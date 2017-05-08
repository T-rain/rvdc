function Visitor(arrival,departure){

    if(typeof(arrival) === "string" && typeof(departure) === "string" ){
        const arrivalTimeArray = arrival.split(":");
        const arrivalHour = parseInt(arrivalTimeArray[0]);
        const arrivalMinute = parseInt(arrivalTimeArray[1]);
        const arrivalTime = arrivalHour*60 + arrivalMinute;

        const departureTimeArray= departure.split(":");
        const departureHour = parseInt(departureTimeArray[0]);
        const departureMinute = parseInt(departureTimeArray[1]);
        const departureTime = departureHour*60 + departureMinute;

        this.getArrival = () => arrivalTime;
        this.getDeparture = () => departureTime;


    }else{
        this.getArrival = () => {console.error("TypeError");};
        this.getDeparture = () => {console.error("TypeError");};
    };

};

const getPersonList = (className)=>{

    let people = document.getElementsByClassName(className);
    let personList = [];
    for (let i = 0; i< people.length;i++){
        let visitor = {};
        let person = people[i].children;
        for(let j = 0; j< person.length;j++){
            if(person[j].className == "arrival"){
                visitor.arrival = person[j].innerHTML;
            }
            if(person[j].className == "departure"){
                visitor.departure = person[j].innerHTML;
            }
        }
        personList.push(visitor);
    }
    return personList;
}

const run = (personList,startTime,endTime)=> {
    let visitors = personList.map(ele =>{
        let visitor = new Visitor(ele.arrival,ele.departure);
        return visitor;
    });
    let visitorsNumber = 0;

    //偵測使用者是否落在區間外
    visitors.forEach((ele,index) =>{
        visitorsNumber = (ele.getDeparture() < startTime || ele.getArrival() > endTime)? visitorsNumber:++visitorsNumber;
        if(index == visitors.length - 1 ){
            alert("maxi-mum number of visitors: "+visitorsNumber)
            visitorsNumber = 0;
        }

    });

}



const createHourOptions = (idTag) =>{
    let hourSelect = document.getElementById(idTag);
    for(let i = 0;i<24;i++){
        let option = document.createElement("option");
        option.text = i;
        hourSelect.add(option);
    }
}

createHourOptions("startHour");
createHourOptions("endHour");
createHourOptions("vstartHour");
createHourOptions("vendHour");


const createMinuteOptions = (idTag) =>{
    let minuteSelect = document.getElementById(idTag);
    for(let i = 0;i<60;i++){
        let option = document.createElement("option");
        option.text = i;
        minuteSelect.add(option);
    }
}

createMinuteOptions("startMinute");
createMinuteOptions("endMinute");
createMinuteOptions("vstartMinute");
createMinuteOptions("vendMinute");

document.getElementById('vsubmit').onclick = () =>{

    const name = document.getElementById("vname").value

    let startHour = document.getElementById("vstartHour").value;
    let startMinute = document.getElementById("vstartMinute").value;

    let endHour = document.getElementById("vendHour").value;
    let endMinute = document.getElementById("vendMinute").value;

    if(name === "" || (parseInt(endHour)*60+parseInt(endMinute)) < parseInt(startHour)*60+parseInt(startMinute) ){
        alert("Wrong format");
    }else {
        let tbody = document.getElementById("people");
        let tr = document.createElement("tr");
        tr.setAttribute('class',"person");
        tbody.appendChild(tr);

        let people = document.getElementsByClassName("person");
        let newPerson = people[people.length - 1];
        const createTD = (classname,value) =>{
            let td = document.createElement("td");
            td.setAttribute('class',classname);
            td.innerHTML = value;
            newPerson.appendChild(td);
        };
        createTD("name",name);

        function addLeftZero(time){
            if(time.length == 1){
                return "0"+time;
            }else{
                return time;
            }
        }

        createTD("arrival",addLeftZero(startHour)+":"+addLeftZero(startMinute));
        createTD("departure",addLeftZero(endHour)+":"+addLeftZero(endMinute));

        // console.log(document.getElementById("people"));

    }


}


document.getElementById('submit').onclick = () =>{

    const startHour = parseInt(document.getElementById("startHour").value);
    const startMinute = parseInt(document.getElementById("startMinute").value);
    const startTime = startHour*60 + startMinute;

    const endHour = parseInt(document.getElementById("endHour").value);
    const endMinute = parseInt(document.getElementById("endMinute").value);
    const endTime = endHour*60 + endMinute;

    if(endTime < startTime){
        alert("Wrong period");
    }else{
        const personList = getPersonList("person");
        run(personList,startTime,endTime);
    }

    // run("09:00","17:00");
}
