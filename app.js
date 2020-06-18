const compoundPurity = document.querySelector(".compound-purity");
const expected = document.querySelector(".expected");
const actual = document.querySelector(".actual");
const impurityList = document.querySelector("#impurity-list");
const molecForm = document.querySelector("#molecular-form");
const molecFormInput = document.querySelector("#molecular-formula");
const molecBtn = document.querySelector("#molecular-btn");
const formulaDisplay = document.querySelector("#formula");
const impurityForm = document.querySelector("#impurity-form");
const impurityFormInput = document.querySelector("#impurity");
const equivalentsFormInput = document.querySelector("#equivalents");
const impurityBtn = document.querySelector("#impurity-btn");
const calculateBtn = document.querySelector("#calculate");
const actualFormInputC = document.querySelector("#actual-resultsC");
const actualFormInputH = document.querySelector("#actual-resultsH");
const actualFormInputN = document.querySelector("#actual-resultsN");
const actualForm = document.querySelector("#actual-form");
const commonImpurityEquiv = document.querySelector("#common-equiv");
const dcm = document.querySelector("#Dichloromethane");
const etoac = document.querySelector("#EtOAc");
const meoh = document.querySelector("#MeOH");
const ether = document.querySelector("#Ether");
const silica = document.querySelector("#Silica");
const water = document.querySelector("#Water");
const percentBtn = document.querySelector("#calculate-purity");
const percentDisplay = document.querySelector("#percent-display");
const impurityPercent = document.querySelector(".percent-impurity")

//UI CONTROLLER---------------------------------------------------------
const UICtrl = (function(){

    //PUBLIC METHODS
    return{
        addMolecularFormulaToUI: function(formula){
            formula = formula.replace(/\s/g, "");
            formulaDisplay.innerText = ` = (${formula})`;
            molecFormInput.disabled = true;
        },
        addExpectedCHN: function(c, h, n){
            if(isNaN(c)){
                c = 'N/A'
            }
            if (isNaN(h)){
                h = 'N/A'
            }    
            if (isNaN(n)){
                n = 'N/A'
            }
            expected.innerHTML = `
            <strong>C: </strong>${c} % <strong>H: </strong>${h} % <strong>N: </strong>${n} %
            `
        },
        addActualCHN: function(c, h, n){
            actual.innerHTML = `
            <strong>C: </strong>${c} % <strong>H: </strong>${h} % <strong>N: </strong>${n} %
            `
        },
        addListItem: function(formula, equiv, id){
           const li = document.createElement("li");
           formula = formula.replace(/\s/g, "")
           li.className = "list-item";
           li.setAttribute("id", id);
         
           li.innerHTML = `
                <div> ${formula} (${equiv} equiv.)</div><div class="id${id}"></div> <i class="fas fa-times delete"></i>
           `;
           impurityList.appendChild(li);
        },
        deleteListItem: function(event){
            if (event.target.classList.contains("delete")){
                event.target.parentElement.remove();
            };
        },
        addPercentagePurity: function(purity, percentImpurities){
            percentDisplay.innerHTML = ` ${purity} %`

            const listItems = document.querySelectorAll("li")
           //Here maybe object.hasOwnProperty('key') would be better
            listItems.forEach(function(item){
                for(const id in percentImpurities){
                    //Probably need this to just change innerTEXT to whatever. Then it won't just keep adding.
                    if(item.id == id){   
                        const span = document.querySelector(`.id${id}`)                     
                        // item.appendChild(document.createTextNode(`${percentImpurities[id]}%`))
                        span.innerText = `  ${percentImpurities[id]}%`
                    }
                }
                

            })
            
        }
    }
})();


//CALCULATION CONTROLLER----------------------------------------------

const CalcCtrl = (function(){
//Need to add way more element masses!
    const elementMasses = {
        H: 1.0079,
        B: 10.811,
        C: 12.0107,
        N: 14.0067,
        O: 15.9994,
        Si: 28.085,
        P: 30.9738,
        S: 32.065,
        F: 18.9984,
        Cl: 35.453,
        Br: 79.904,
        I: 126.9045,
        Li: 6.941,
        Na: 22.990,
        K: 39.0983

    };
    //Need To Add Their Chemical Formulas. Nested Objects etc
    const commonImpurities = {
        Dichloromethane: {
            molecWeight: 84.9326,
            chemicalFormula: [['C', 1], ['H', 2], ['Cl', 2]],
    
        },
        EtOAc: {
            molecWeight: 88.1051,
            chemicalFormula: [['C', 4], ['H', 8], ['O', 2]],
            
        },
        MeOH: {
            molecWeight: 32.0419,
            chemicalFormula: [['C', 1], ['H',4], ['O', 1]],
            
        },
        Ether: {
            molecWeight: 74.1216,
            chemicalFormula: [['C', 4], ['H', 6], ['O', 1]]
        },
        Silica: {
            molecWeight: 60.08430,
            chemicalFormula: [['Si', 1], ['O', 2]]
        },
        Water: {
            molecWeight: 18.01528,
            chemicalFormula: [['H', 2], ['O', 1]]
        }
    };

    //PUBLIC METHODS

    return {
        calculateCHN: function(totalMolecularFormulaArray, totalElementMasses){
            const chn = {}
           
            totalMolecularFormulaArray.forEach(function(item){
                const element = item[0]
                const equivalents = item[1]
                if(element === 'C'){
                    chn['C'] = (equivalents * elementMasses.C)
                } else if (element === 'H'){
                    chn['H'] = (equivalents * elementMasses.H)
                } else if (element === 'N'){
                    chn['N'] = (equivalents * elementMasses.N)
                }
            })
                const percentC = ((chn.C / totalElementMasses) * 100).toFixed(2);
                const percentH = ((chn.H / totalElementMasses) * 100).toFixed(2);
                const percentN = ((chn.N / totalElementMasses) * 100).toFixed(2);
                
                return {
                    percentC,
                    percentH,
                    percentN
        }
    },
        calculateComposition: function(formula, equivalents){
            // Take molecular formula and turn each element + equivalents into an array
            const formulaArr = formula.split(" ");
        
            let amountArray = [];
            let totalMassArr = [];
                      
            formulaArr.forEach(function(element){
                    let amount = element.split("");
                    amountArray.push(amount);
                       
            });

            //accounting for element symbols that have two letters
            amountArray.forEach(function(item = 1){
                let pattern = /[a-z]/;
              
                if(pattern.test(item[1]) && item[1] !== undefined){
                    item[0] += item[1];
		            item.splice(1, 1);
                };
            })
            
            // create new array with equivalents parsed into numbers
            let mappedArray = amountArray.map(function(element){ 

               if(element[1]){
                   element[1] = parseInt(element[1]);
               } else {
                   element[1] = 1;
               }
                return element;
            });
           
            if(equivalents){
                //If there are equivalents to be applied:
                mappedArray = mappedArray.map(function(element){
                    element[1] = element[1] * equivalents
                    return element
                })
            }
        
            // need to go through and get total mass for each element and push to total mass array
            mappedArray.forEach(function(element){
                //get total mass for each element
                elementMassTotal = elementMasses[element[0]] * element[1];
                totalMassArr.push(elementMassTotal);                
             });
            //add up all the total masses in totalMassArray
            const totalMass = totalMassArr.reduce((acc, mass) => acc + mass);
            console.log(totalMass, mappedArray)
            
            return {
                totalMass: totalMass,
                formulaArr: mappedArray
            }
            
        },
        calculateMassOfImpurity: function(equivalents, molecularWeight){
            const massOfImpurity = equivalents * molecularWeight;
            return massOfImpurity
        },
        calculateMassOfCommonImpurity: function(impurity, equivalents){
            const massOfCommonImpurity = equivalents * commonImpurities[impurity].molecWeight;
            return massOfCommonImpurity;
        },
        calculateTotalMass: function(totalMassArr){
            const totalMass = totalMassArr.reduce((acc, mass) => acc += mass, 0)
            return totalMass;
        },
        calculateCommonElementEquivalents: function(impurity, equivalents){

            let commonMolecularFormulaObject = {};
            
            const chemicalFormulaCommonArray = commonImpurities[impurity].chemicalFormula;
            chemicalFormulaCommonArray.map(function(element){
                element[1] = element[1] * equivalents;

                //If element exists, add equivalents to it
                if(commonMolecularFormulaObject[element[0]]){
                    commonMolecularFormulaObject[element[0]] += element[1];
                //If element does not exist, add it to object    
                } else{
                    commonMolecularFormulaObject[element[0]] = element[1];
                }
                
            })
          
            return commonMolecularFormulaObject

            
        },
        calculateFinalCHN: function(totalMolecularFormulaArray, totalChemicalMasses){
            const chn = {}
            // const totalMolecularFormulaArray = ItemCtrl.getMassesOfMixture()
            totalMolecularFormulaArray.forEach(function(item){
                const element = item[0]
                const equivalents = item[1]

                if(element === 'C'){
                    chn['C'] = (equivalents * elementMasses.C)
                } else if (element === 'H'){
                    chn['H'] = (equivalents * elementMasses.H)
                } else if (element === 'N'){
                    chn['N'] = (equivalents * elementMasses.N)
                }
            })

                const percentC = ((chn.C / totalChemicalMasses) * 100).toFixed(2);
                const percentH = ((chn.H / totalChemicalMasses) * 100).toFixed(2);
                const percentN = ((chn.N / totalChemicalMasses) * 100).toFixed(2);
                
                return {
                    percentC,
                    percentH,
                    percentN
            }
        }
    }
})();

// ITEM CONTROLLER-------------------
const ItemCtrl = (function(){
    const molecularFormulas = [];

    return {
     
        getFormulas: function(){
            return molecularFormulas
        },
        addToMolecularFormulaArray: function(formulaObj){
            molecularFormulas.push(formulaObj)
        },
        
    }


})()


const App = (function(CalcCtrl, UICtrl, ItemCtrl){

    //EVENT LISTENERS
    const loadEventListeners = function(){
        molecForm.addEventListener("submit", getMolecularFormulaMassAndComposition);
        impurityForm.addEventListener("click", getImpurityValues);
        actualForm.addEventListener("submit", getActualResults);
        impurityList.addEventListener("click", deleteItem);
        dcm.addEventListener("click", getCommonImpurity);
        etoac.addEventListener("click", getCommonImpurity);
        meoh.addEventListener("click", getCommonImpurity);
        ether.addEventListener("click", getCommonImpurity);
        silica.addEventListener("click", getCommonImpurity);
        water.addEventListener("click", getCommonImpurity);
        calculateBtn.addEventListener("click", finalCHN);
        percentBtn.addEventListener("click", getPurity)
    };

    const getMolecularFormulaMassAndComposition = function(event){
        //Get molecular formula from input
        const molecularFormula = molecFormInput.value;
        
        if(molecularFormula !== ""){
            //Add formula to the UI
            UICtrl.addMolecularFormulaToUI(molecularFormula);
            //Calculate the composition and then use destructuring to get formula array and total mass
            const { formulaArr, totalMass } = CalcCtrl.calculateComposition(molecularFormula);
            //Calculate CHN results from the composition results
            const { percentC, percentH, percentN } = CalcCtrl.calculateCHN(formulaArr, totalMass)
            //Add the CHN results to the UI            
            UICtrl.addExpectedCHN(percentC, percentH, percentN);

            //Move all the array stuff to molecular formula object
            const molecularFormulaObject = {};
            formulaArr.forEach(function(element){
                //creating each property of the object                
                molecularFormulaObject[element[0]] = element[1];
            });
            //Generate random ID for object
            molecularFormulaObject['id'] = (Math.floor(Math.random() * 10000000))
            //Add mass to object
            molecularFormulaObject['mass'] = totalMass
            //Add object to item controller
            ItemCtrl.addToMolecularFormulaArray(molecularFormulaObject)
            //Clear the input 
            molecFormInput.value = "";   
        }
        event.preventDefault();
    };


    const getActualResults = function(event){
        //Take actual results data
        if(actualFormInputC.value !== "" && actualFormInputH.value !== "" && actualFormInputN.value !== ""){
            const actualCarbon = parseFloat(actualFormInputC.value).toFixed(2);
            const actualHydrogen = parseFloat(actualFormInputH.value).toFixed(2);
            const actualNitrogen = parseFloat(actualFormInputN.value).toFixed(2);
        //Add data to UI for comparison    
        UICtrl.addActualCHN(actualCarbon, actualHydrogen, actualNitrogen);
        //Reset fields    
        actualFormInputC.value = "";
        actualFormInputH.value = "";
        actualFormInputN.value = "";
        //Disable the form input    
        actualFormInputC.disabled = true;
        actualFormInputH.disabled = true;
        actualFormInputN.disabled = true;
        }
        
    
        event.preventDefault();
    };

    const getImpurityValues = function(event){
        //If both fields have been filled out, get data from form
        if(impurityFormInput.value !== "" && equivalentsFormInput.value !== ""){
            const formula = impurityFormInput.value;
            const equivalents = parseFloat(equivalentsFormInput.value).toFixed(3); 
            //clear the fields
            impurityFormInput.value = "";
            equivalentsFormInput.value = "";
            //Calculate the composition and return an object with the results
            const { formulaArr, totalMass } = CalcCtrl.calculateComposition(formula, equivalents);
            const massOfImpurity = totalMass            
            //create empty object
            const molecularFormulaObject = {};
            //convert formula array of arrays into molecular formula object
            formulaArr.forEach(function(element){              
                molecularFormulaObject[element[0]] = element[1];
            });
            //Generate random ID for object
            molecularFormulaObject['id'] = (Math.floor(Math.random() * 10000000))
            //Add impurity mass to the object
            molecularFormulaObject['mass'] = massOfImpurity;
            //Update the UI 
            UICtrl.addListItem(formula, equivalents, molecularFormulaObject['id'])
            //Add the final object to the item controller
            ItemCtrl.addToMolecularFormulaArray(molecularFormulaObject)
           
                        
            
            }
            
            event.preventDefault();
        };

        const getCommonImpurity = function(event){
    
            if(commonImpurityEquiv.value !== ""){
                //Get data
                const impurityToAdd = event.target.id;
                const commonEquivalents = parseFloat(commonImpurityEquiv.value).toFixed(3);
                //calculate mass and add to item controller
                const massOfImpurity = CalcCtrl.calculateMassOfCommonImpurity(impurityToAdd, commonEquivalents);
                // ItemCtrl.addMassItem(massOfImpurity);
                
                //calculate formula and add to item controller
                const molecularFormulaObject = CalcCtrl.calculateCommonElementEquivalents(impurityToAdd, commonEquivalents);
                //Generate random ID for object
                molecularFormulaObject['id'] = (Math.floor(Math.random() * 10000000));
                //Add mass to object
                molecularFormulaObject['mass'] = massOfImpurity;
                //Add impurity object to item controller
                ItemCtrl.addToMolecularFormulaArray(molecularFormulaObject);

                //add common impurity to UI    
                UICtrl.addListItem(impurityToAdd, commonEquivalents, molecularFormulaObject['id']);
                //clear inputs
                commonImpurityEquiv.value = "";
            } 
           
            event.preventDefault();
        }

        const deleteItem = function(event){
            //Get target list item id
            const id = parseInt(event.target.parentElement.id);
            //Get the formula array of objects
            const formulaArr = ItemCtrl.getFormulas();
            //loop through and match id
            formulaArr.forEach(function(item, index){
                if(item.id === id){
                    //if they match, remove the item
                    formulaArr.splice(index, 1);
                }
            });

            UICtrl.deleteListItem(event)
        }

        const finalCHN = function(event){
            
            const totalMassArray = []
             //Get the array of formula objects
            const totalFormulas = ItemCtrl.getFormulas()
            
            totalFormulas.forEach(function(item){
                totalMassArray.push(item['mass'])
            })

            //calculate what the total mass is now
            const totalMass = CalcCtrl.calculateTotalMass(totalMassArray);
        
            //Merge the objects to give the combined formula

            const combinedFormulaArr = merge(totalFormulas);

            //merge function MAYBE THIS CAN JUST RETURN AN ARRAY NOT AN OBJECT?????????????????

            //totalFormula array of objects run through merge
            function merge(totalFormulas){
                //for each of the objects
                const merged = totalFormulas.reduce(function(a, formulaObject){
                    //Turn each object into an array of arrays containing element and equivalents
                    array = Object.entries(formulaObject);
                    //Loop through the array designating the key and the value
                    array.forEach(([key, val]) => {
                      a[key] = (a[key] || 0) + val;
                    });
                    return a;
                  }, {});
        
                  return Object.entries(merged)  
                }
            //Calculate final CHN    
            const {percentC, percentH, percentN} = CalcCtrl.calculateFinalCHN(combinedFormulaArr, totalMass);
            //Add CHN to UI
            UICtrl.addExpectedCHN(percentC, percentH, percentN);

            event.preventDefault();
        }

        const getPurity = function(){
            //Retrieve all the chemical objects
            const formulas = ItemCtrl.getFormulas()
            const totalMassArray = []
            //Create a mass array from the objects
            formulas.forEach(function(item){
                totalMassArray.push(item['mass'])
            })
            //Calculate total mass by passing totalMassArray to calculation controller
            const totalMass = CalcCtrl.calculateTotalMass(totalMassArray);
            //The product mass is the first mass in the array
            const productMass = totalMassArray[0];
            //calculate the purity
            const purity = ((productMass/totalMass) * 100).toFixed(1)
           

            const percentImpurities = getPercentageImpurities(formulas, totalMass);
            console.log(percentImpurities);

             //Add % purities to the UI
             UICtrl.addPercentagePurity(purity, percentImpurities);
        }

        const getPercentageImpurities = function(formulas, totalMass){
            const percentageImpurities = {}
            
            formulas.forEach(function(item){
                
                percentageImpurities[item.id] = ((item.mass/totalMass) *100).toFixed(1);
            })

            return percentageImpurities
        }

//Public Methods   
return {
    init: function(){
        loadEventListeners();
    }
}

})(CalcCtrl, UICtrl, ItemCtrl)

App.init();


 