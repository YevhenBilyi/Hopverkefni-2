import { fetchData } from "./data.js";

let myData, projects, finishedProjects, vefforitF, skipulagF,vefF;


// saving object to myData on load
window.onload = async()=>{
    console.log("before");
    fetchData().then(function(result){

        // filtering out deleted projects
        myData = result.items.filter(task=> !task.deleted);

        getNewArrays();
    });   
}


//making arrays by category and getting all tags and their quantity
function getNewArrays(){
    finishedProjects = myData.filter(item=>item.completed);
    projects=myData.filter(item=>!item.completed);
    vefforitF=projects.filter(item=>item.category=="vefforrit");
    skipulagF=projects.filter(item=>item.category=="skipulag");
    vefF=projects.filter(item=>item.category=="vefþjónustur");

    // creating list of all tags
    const tags=[];
    
    for(let i in myData){
        for(let j in myData[i].tags){
            if(!tags.includes(myData[i].tags[j])) tags.push(myData[i].tags[j]);
        }
    }
   
   // deleting old tages before creating new ones
    const elements = document.getElementsByClassName("createdTags");
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }

     // creating tags name with their quantity
    for(let tag in tags){
        let array = projects.filter(item=>item.tags.includes(tags[tag]))
        createTags(tags[tag], array.length);
    }
    
    // updating quantity by category
    updateQuantities("verkefni-num", projects.length);
    updateQuantities("verkefni2-num", finishedProjects.length);
    updateQuantities("vefforit-num", vefforitF.length);
    updateQuantities("skipulag-num", skipulagF.length);
    updateQuantities("vefþjónustur-num", vefF.length);

}

//putting quantities of Flokkar
function updateQuantities (className, num){
    document.getElementById(className).innerHTML=""+num;
}

// creating new tags on left side with their quantities
function createTags(tag, num){
    let newTag = document.getElementById("tags");
    const div = document.createElement("div");
    div.classList.add("createdTags");
    const h3= document.createElement("h3");
    const h3T = document.createTextNode(tag);
    h3.onclick=()=>{
        let filteredData = myData.filter(item=>item.tags.includes(tag));
        printData(filteredData);
    }
    h3.appendChild(h3T);

    const p = document.createElement("p");
    const pT = document.createTextNode(num);
    p.appendChild(pT);

    div.appendChild(h3);
    div.appendChild(p);

    insertAfter(div,newTag);

}

//inserting new element after referenced one
function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

// looping through array of objects and posting them on screen
function printData(data){
    document.getElementById("task").innerHTML="";
    let sort = document.getElementById("sortingBy");
    sort.addEventListener('change', ()=> printData(data));
    console.log(sort.value);
    //sorting by id
    if (sort.value == "1") data.sort(function(a, b) { 
        return a.id - b.id });
    
    //sorting by due
    if(sort.value == "2") data.sort(function(a,b){
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(b.due) - new Date(a.due);
      });
    if(sort.value == "3") data.sort(function(a,b){return a.priority-b.priority}).reverse()
    console.log(data);
    for(const item in data){
        createTask(data[item]);
    }
}
//creating elements from given object
function createTask(obj){
        const element = document.getElementById("task")
        // checkbox
        const input = document.createElement("input");
        input.type = "checkbox";
        input.id = obj.id;

        // change to finished on click of checkbox of project
        input.addEventListener('click', ()=> finishProject(obj.id))

        // title
        const label = document.createElement("label");
        const title = document.createTextNode(obj.title);
        label.appendChild(title);

        //flokkur
        const flokkur = document.createElement("div");
        flokkur.className = "flokkur";
        flokkur.id = obj.id;

        //due
        const due = document.createElement("p");

        //check if it exist
        const dueText = document.createTextNode(obj.due==null? "none": obj.due);
        due.appendChild(dueText);

        // category
        const category = document.createElement("label");
        const categoryText = document.createTextNode(obj.category);
        category.appendChild(categoryText);

        //description
        const para = document.createElement("p");
        const node = document.createTextNode(obj.description);
        para.appendChild(node);
        element.appendChild(input);
        element.appendChild(label);
        element.appendChild(para);
        flokkur.appendChild(due);

        //tags
        for( const tag in obj.tags){
            const button =  document.createElement("button");
            const tagText = document.createTextNode(obj.tags[tag]);
            button.appendChild(tagText);
            flokkur.appendChild(button);
        }
        flokkur.appendChild(category);

        //edit button to change all of the properties
        const editButton = document.createElement("button");
        editButton.innerHTML="EDIT";
        editButton.addEventListener('click',()=>editTask(obj.id));
        // div for editing
        const editingDiv= document.createElement("div");
        editingDiv.id = "edit N"+obj.id.toString();
        flokkur.appendChild(editButton);
        element.appendChild(flokkur);
        element.appendChild(editingDiv);


        
}

function editTask(id){
    const parent = document.getElementById("edit N"+id.toString());
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

    //priority
    const priority = document.createElement("select");
    const opt1 = document.createElement("option");
    opt1.innerHTML = "Priority";
    opt1.value = true;
    const opt2 = document.createElement("option");
    opt2.innerHTML = "Non priority";
    opt2.value = false;
    priority.appendChild(opt1);
    priority.appendChild(opt2);

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
        changeProject(descriptionInput.value,dateInput.value,ar,category.value, titleInput.value, id, priority.value)}
         )
    

    //setting deleted of project to true
    const deleteProject = document.createElement("button");
    deleteProject.innerHTML="Delete";
    deleteProject.addEventListener('click', ()=>{
        console.log(myData.find(p=> p.id==id).deleted);
        myData.find(p=> p.id==id).deleted = true;
        myData = myData.filter(task=> !task.deleted);

        getNewArrays();
        document.getElementById("task").innerHTML="";
    })   

    parent.appendChild(titleInput);
    parent.appendChild(descriptionInput);
    parent.appendChild(dateInput);
    parent.appendChild(tagInput);
    parent.appendChild(tagInput2);
    parent.appendChild(tagInput3);
    parent.appendChild(category);
    parent.appendChild(priority);
    parent.appendChild(cancel);
    parent.appendChild(add);
    parent.appendChild(deleteProject);
}

function changeProject(description, date, ar, category,title, id, priority){
   if(description!="") myData.find(p=> p.id==id).description=description;
   if(date!="") myData.find(p=> p.id==id).due = date;
   if(ar.length>0) myData.find(p=> p.id==id).tags=ar;
   myData.find(p=> p.id==id).category=category;
   var isTrue = (priority==='true');
   myData.find(p=> p.id==id).priority= isTrue;
   if(title!="") myData.find(p=> p.id==id).title=title;
   getNewArrays();
   document.getElementById("edit N"+id.toString()).innerHTML="";
   document.getElementById("task").innerHTML="";
}
// change property completed to different one(true to false and false to true)
function finishProject(id){
    myData.find(p=> p.id==id).completed = !myData.find(p=> p.id==id).completed;
    getNewArrays();
}

// show creation of new task 
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

    //priority
    const priority = document.createElement("select");
    const opt1 = document.createElement("option");
    opt1.innerHTML = "Priory";
    opt1.value = true;
    const opt2 = document.createElement("option");
    opt2.innerHTML = "Non priority";
    opt2.value = false;
    priority.appendChild(opt1);
    priority.appendChild(opt2);

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
        addNewTaskToList(descriptionInput.value,dateInput.value,ar,category.value, titleInput.value, priority.value)}
         )

    parent.appendChild(titleInput);
    parent.appendChild(descriptionInput);
    parent.appendChild(dateInput);
    parent.appendChild(tagInput);
    parent.appendChild(tagInput2);
    parent.appendChild(tagInput3);
    parent.appendChild(category);
    parent.appendChild(priority);
    parent.appendChild(cancel);
    parent.appendChild(add);
    

}


//getting all the info from input fields and putting it into myData
function addNewTaskToList(description, date,tags,category, title, priority){
    console.log(date);
    let newTask = {
        category,
        description,
        due:date,
        completed:false,
        deleted:false,
        id: myData.length.toString(),
        modified: 1635638400000,
        priority: priority==="true",
        tags,
        title,
        }
    myData.push(newTask);
    getNewArrays();
    document.getElementById("createTask").innerHTML="";

}