import { fetchData } from "./data.js";

let myData, projects, finishedProjects, vefforitF, skipulagF,vefF;


// saving object to myData on load
window.onload = async()=>{
    console.log("before");
    fetchData().then(function(result){
        myData = result.items;
        getNewArrays();
    });   
}


//making arrays by category and getting all tags and their quantity
function getNewArrays(){
    finishedProjects = myData.filter(item=>item.completed);
    projects=myData.filter(item=>!item.completed);
    vefforitF=myData.filter(item=>item.category=="vefforrit");
    skipulagF=myData.filter(item=>item.category=="skipulag");
    vefF=myData.filter(item=>item.category=="vefþjónustur");

    // creating list of all tags
    const tags=[];
    for(let i in myData){
        for(let j in myData[i].tags){
            if(!tags.includes(myData[i].tags[j])) tags.push(myData[i].tags[j]);
        }
    }
    // creating tags name with their quantity
    for(let tag in tags){
        let array = myData.filter(item=>item.tags.includes(tags[tag]))
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
        element.appendChild(flokkur);
}
// need to work on it
document.querySelector('button#add').addEventListener('click', getNewArrays);

// print one of filtered arrays based on category or finished/unfinished
document.getElementById("projects-link").addEventListener('click',()=>printData(projects));
document.getElementById("finished-link").addEventListener('click',()=>printData(finishedProjects));
document.getElementById("vefforitF-link").addEventListener('click',()=>printData(vefforitF));
document.getElementById("skipulagF-link").addEventListener('click',()=>printData(skipulagF));
document.getElementById("vefF-link").addEventListener('click',()=>printData(vefF));
