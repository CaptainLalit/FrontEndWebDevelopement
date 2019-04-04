///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////                                                                                              ///////
//////                                  MODULE OF BUDGET CONTROLLER                                 ///////
//////                                                                                              ///////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
var budgetController = (function() {
    
    var Expenses = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var data = {
        allitems: {
            exp: [],
            inc: []
        },  
        total: {
            exp: 0,
            inc: 0
        }
    };
    
    return {
        addItem: function(type, description, value) {
            var ID;
            var obj;
            
            if (data['allitems'][type].length != 0) {
                ID = data.allitems[type][data['allitems'][type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            
            if (type === 'inc') {
                obj = new Income(ID, description, value);
                data.total.inc += obj.value;
            } else if (type === 'exp') {
                obj = new Expenses(ID, description, value);
                obj.percentage = Math.round(value / data.total.exp * 100);
                data.total.exp += obj.value;
            }
            
            data.allitems[type].push(obj);
            
            return obj;
        },
        
        testing: function() {
            console.log(data);
        },
        
        values: function() {
            return {
                income: data.total.inc,
                expense: data.total.exp
            }
        },
        
        percentage: function() {
            
            if (data.total.inc > 0) {
                return Math.round(data.total.exp / data.total.inc * 100);    
            } else {
                return 1;
            }
        },
        
        updateAllExpensesPrecentage: function() {
            
            for(var i = 0; i < data.allitems.exp.length; i++) {
                data.allitems.exp[i].percentage = Math.round(data.allitems.exp[i].value / data.total.exp * 100);
            }
            
            return data.allitems.exp;
        },
        
        deleteItem: function(type, id) {
            var index, length = data.allitems[type].length;
            for( index = 0; index < length; index++) {
                if (data.allitems[type][index].id == id) {
                    break;
                }

            }
            
            data.total[type] -= data.allitems[type][index].value;
            data.allitems[type].splice(index, 1);
            
            return data.allitems[type];
        }
    };
    
})();






///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////                                                                                              ///////
//////                                  MODULE OF UI CONTROLLER                                     ///////
//////                                                                                              ///////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
var uiController = (function() {
    
    var DOMstring = {
        type: '.input__type',
        description: '.input__description',
        value: '.input__value',
        submit: '.submit',
        bottom__inc: '.bottom__income',
        bottom__exp: '.bottom__expense',
        exp__perc: '.expense__perc',
        inc: '.income__container',
        exp: '.expense__container',
        totalBudget: '.total__budget',
        totalIncome: '.income__value',
        totalExpense: '.expense__value',
        container: '.bottom'
    };
    
    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstring.type).value,
                description: document.querySelector(DOMstring.description).value,
                value: parseFloat(document.querySelector(DOMstring.value).value)
            }
        },
        
        getStrings: function() {
            return DOMstring;
        },
        
        addListItem: function(obj, type) {
            var html, element;
            
            if (type === 'inc') {
                element = DOMstring.inc;
                html = '<div class= "income__container"><div class = "incomeStyle" id = "inc-%ID%"><div class = "desc">%desc%</div><button class = "cancelBtn">X</button><div class = "val">+ %value%</div></div>';
            } else if ( type === 'exp') {
                element = DOMstring.exp;
                html = '<div class= "expense__container"><div class = "expenseStyle" id = "exp-%ID%"><div class = "desc">%desc%</div><button class = "cancelBtn">X</button><div class = "val">- %value%</div><div class = "percentage">%perc%%</div></div>';
            }
            
            // Replacing the placeholders
            html = html.replace('%ID%', obj.id);
            html = html.replace('%desc%', obj.description);
            html = html.replace('%value%', obj.value);
            html = html.replace('%perc%', obj.percentage);
            // Inserting the object into ui
            document.querySelector(element).insertAdjacentHTML('beforeend', html);
        },
        
        clearfields: function() {
            var fields, fieldArr;
            
            // Returns a list
            fields = document.querySelectorAll(DOMstring.description + ',' + DOMstring.value);
            
            // Converting the list into an array
            fieldArr = Array.prototype.slice.call(fields);
            
            fieldArr.forEach(function(current, index, array) {
                current.value = "";
                
            document.querySelector(DOMstring.type).value = 'inc';
            });
            
            // Focusing the cursor on element(fieldArr[0])
            fieldArr[0].focus();
        },
        
        values: function(val) {
            var total, sign = "";
            
            // 1. Updating the total money 
            total = val.income - val.expense
            if (total > 0) {
                sign = '+ ';
            } else if(total < 0){
                total *= -1;
                sign = '- ';
            }
            document.querySelector(DOMstring.totalBudget).innerHTML = sign + total;
            document.querySelector(DOMstring.totalIncome).innerHTML = '+ ' + val.income;
            document.querySelector(DOMstring.totalExpense).innerHTML = '- ' + val.expense;
        },
        
        expensePercentage: function(perc) {
            document.querySelector(DOMstring.exp__perc).innerHTML = '- ' + perc + ' %';
        },
        
        clearAllExpense: function() {
            document.querySelector(DOMstring.exp).innerHTML = '';
        },
        
        clearAllIncome: function() {
            document.querySelector(DOMstring.inc).innerHTML = '';
        }
        
    }
    
})();







///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////                                                                                              ///////
//////                  MODULE WHICH CONNECT uiController AND budgetController                      ///////
//////                                                                                              ///////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
var connector = (function(budgetCtrl, uiCtrl) {
    
    var allEventListners = function() {    
        var String = uiCtrl.getStrings();
        
        // Setting blinking cursor to description field 
        document.querySelector(String.description).focus();
        
        document.querySelector(String.submit).addEventListener('click', ctrladdItem);
    
        document.addEventListener('keypress', function(event) {
            if (event.keycode === 13 || event.which === 13) {
                ctrladdItem();
            }
        });  
        
        document.querySelector(String.container).addEventListener('click', ctrlDeleteItem);
    };
    
    var updateBudget = function(type, Arr, afterDeleting) {
        var value, perc, allExpense;
        // 1. Calculate budget
        value = budgetCtrl.values();
        
        // 2. Updating the ui
        uiCtrl.values(value);
        
        // Calculating percentage share of expense in total income
        perc = budgetCtrl.percentage();
        uiCtrl.expensePercentage(perc);
        
        // Updating the individual percentage of expense and deleted items
        if (type === 'exp') {
            allExpense = budgetCtrl.updateAllExpensesPrecentage();
            uiCtrl.clearAllExpense();
            for(var i = 0; i < allExpense.length; i++) {
                uiCtrl.addListItem(allExpense[i], 'exp');
            }
        } else if(type === 'inc' && afterDeleting) {
            uiCtrl.clearAllIncome();
            for(var i = 0; i < Arr.length; i++) {
                uiCtrl.addListItem(Arr[i], 'inc');
            }
        }
    };
    
    var ctrladdItem = function() {
        var input, object;
        
        // 1. Get input from the ui
        input = uiCtrl.getInput();
        
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. Add input to budget controller
            object = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add input to the ui
            uiCtrl.addListItem(object, input.type);

            // 4. Clearing the fields
            uiCtrl.clearfields();
            
            // 5. Updating the budget and ui
            updateBudget(input.type, 0, 0);
        }
    };
    
    
    var ctrlDeleteItem = function(event) {
        var clickId, details, type, id, newArr;
        
        clickId = event.target.parentNode.id;
        
        if (clickId) {

            details = clickId.split('-');
            type = details[0];
            id = details[1];

            // Deleteing the clicked item from the array in budget controller module 
            newArr = budgetCtrl.deleteItem(type, id);
            
            // Updating the ui
            updateBudget(type, newArr, 1);
        }
    };
    
    return {
        init: function() {
            allEventListners();
        }
    }
})(budgetController, uiController);


connector.init();






