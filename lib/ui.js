import { fetchData } from './data.js';
import { empty } from './helpers.js';

let myData; 
let projects;
let finishedProjects;
let vefforitF;
let skipulagF;
let vefF;

// saving object to myData on load
/*
window.onload = async()=>{
    console.log("before");
    fetchData().then(function(result){

        // filtering out deleted projects
        myData = result.items.filter(task=> !task.deleted);

        getNewArrays();
    });   
}
*/

export function dataMain() {
fetchData().then((result) => {
  myData = result.items;
  getNewArrays();
});   
}

// making arrays by category and getting all tags and their quantity
export function getNewArrays(){
    finishedProjects = myData.filter(item=>item.completed);
    projects=myData.filter(item=>!item.completed);
    vefforitF=myData.filter(item=>item.category === 'vefforrit');
    skipulagF=myData.filter(item=>item.category === 'skipulag');
    vefF=myData.filter(item=>item.category === 'vefþjónustur');

    // creating list of all tags
    const tags=[];
    for(const i in myData){
      if(i) {
        for(const j in myData[i].tags){
            if(!tags.includes(myData[i].tags[j])) tags.push(myData[i].tags[j]);
        }
      }
    }
    // creating tags name with their quantity
    for(const tag in tags){
      if(tag) {
        const array = myData.filter(item=>item.tags.includes(tags[tag]))
        createTags(tags[tag], array.length);
      }
    }
    
    // updating quantity by category
    updateQuantities('verkefni-num', projects.length);
    updateQuantities('verkefni2-num', finishedProjects.length);
    updateQuantities('vefforit-num', vefforitF.length);
    updateQuantities('skipulag-num', skipulagF.length);
    updateQuantities('vefþjónustur-num', vefF.length);

}

// putting quantities of Flokkar
function updateQuantities (className, num){
    document.getElementById(className).innerHTML = ''.concat(num);
}

// creating new tags on left side with their quantities
function createTags(tag, num){
    const newTag = document.getElementById('tags');
    const div = document.createElement('div');
    empty(div);

    const h3= document.createElement('h3');
    const h3T = document.createTextNode(tag);
    h3.onclick=()=>{
        const filteredData = myData.filter(item=>item.tags.includes(tag));
        printData(filteredData);
    }
    h3.appendChild(h3T);

    const p = document.createElement('p');
    const pT = document.createTextNode(num);
    p.appendChild(pT);

    div.appendChild(h3);
    div.appendChild(p);

    insertAfter(div,newTag);

}

// inserting new element after referenced one
function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

// looping through array of objects and posting them on screen
function printData(data){
    document.getElementById('task').innerHTML='';
    for(const item in data){
      if(item)
        createTask(data[item]);
    }
}
// creating elements from given object
function createTask(obj){
        const element = document.getElementById('task');
        // checkbox
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.id = obj.id;

        // title
        const label = document.createElement('label');
        const title = document.createTextNode(obj.title);
        label.appendChild(title);

        // flokkur
        const flokkur = document.createElement('div');
        flokkur.className = 'flokkur';
        flokkur.id = obj.id;

        // due
        const due = document.createElement('p');

        // check if it exist
        const dueText = document.createTextNode(obj.due==null? 'none': obj.due);
        due.appendChild(dueText);

        // category
        const category = document.createElement('label');
        const categoryText = document.createTextNode(obj.category);
        category.appendChild(categoryText);

        // description
        const para = document.createElement('p');
        const node = document.createTextNode(obj.description);
        para.appendChild(node);
        element.appendChild(input);
        element.appendChild(label);
        element.appendChild(para);
        flokkur.appendChild(due);

        // tags
        for( const tag in obj.tags){
          if(tag) {
            const button =  document.createElement('button');
            const tagText = document.createTextNode(obj.tags[tag]);
            button.appendChild(tagText);
            flokkur.appendChild(button);
          }
        }
        flokkur.appendChild(category);
        element.appendChild(flokkur);
}
// need to work on it
document.querySelector('button#add').addEventListener('click', createNewTask);

// print one of filtered arrays based on category or finished/unfinished
document.getElementById("projects-link").addEventListener('click',()=>printData(projects));
document.getElementById("finished-link").addEventListener('click',()=>printData(finishedProjects));
document.getElementById("vefforitF-link").addEventListener('click',()=>printData(vefforitF));
document.getElementById("skipulagF-link").addEventListener('click',()=>printData(skipulagF));
document.getElementById("vefF-link").addEventListener('click',()=>printData(vefF));


// creating input fields for new task
function createNewTask(){
    const parent = document.getElementById("createTask");
    parent.innerHTML="";

    const descriptionInput = document.createElement("input");
    descriptionInput.placeholder = "description";

    const titleInput = document.createElement("input");
    titleInput.placeholder = "title";

    //time
    const dateInput = document.createElement("input");
    dateInput.placeholder="date ";
    dateInput.type="date";

    //tags
    const tagInput = document.createElement("input");
    tagInput.placeholder="tag";
    const tagInput2 = document.createElement("input");
    tagInput2.placeholder="tag";
    const tagInput3 = document.createElement("input");
    tagInput3.placeholder="tag";

    //category
    const category = document.createElement("select");
    const option1 = document.createElement("option");
    option1.innerHTML = "Vefforrit";
    option1.value = "vefforrit";
    const option2 = document.createElement("option");
    option2.innerHTML = "Skipulag";
    option2.value = "skipulag";
    const option3 = document.createElement("option");
    option3.innerHTML = "Vefþjónustur";
    option3.value = "vefþjónustur";
    category.appendChild(option1);
    category.appendChild(option2);
    category.appendChild(option3);

    //buttons
    const cancel = document.createElement("button");
    cancel.textContent="Cancel";
    cancel.addEventListener('click', ()=>parent.innerHTML='');

    const add = document.createElement("button");
    add.textContent = "Confirm";
    add.addEventListener('click',()=>{
        const ar = [];
        if (!tagInput.value=="") ar.push(tagInput.value);
        if (!tagInput2.value=="") ar.push(tagInput2.value);
        if (!tagInput3.value=="") ar.push(tagInput3.value);
        addNewTaskToList(descriptionInput.value,dateInput.value,ar,category.value, titleInput.value)}
         )

    parent.appendChild(titleInput);
    parent.appendChild(descriptionInput);
    parent.appendChild(dateInput);
    parent.appendChild(tagInput);
    parent.appendChild(tagInput2);
    parent.appendChild(tagInput3);
    parent.appendChild(category);
    parent.appendChild(cancel);
    parent.appendChild(add);

}


//getting all the info from input fields and putting it into myData
function addNewTaskToList(description, date,tags,category, title){
    console.log(date);
    let newTask = {
        category,
        description,
        due:date,
        completed:false,
        deleted:false,
        id: myData.length.toString(),
        modified: 1635638400000,
        priority: false,
        tags,
        title
        }
    myData.push(newTask);
    getNewArrays();
    document.getElementById("createTask").innerHTML="";

}
