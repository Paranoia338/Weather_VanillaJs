const request = new XMLHttpRequest();


var jsonObject;
var temperaturaVarGlob;

// var buton_conversie = document.getElementById("buton");
const convertorTimpUnix = (time_secquence) => {
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    var date = new Date(time_secquence * 1000);
    // Hours part from the timestamp
    var hours = date.getHours();
    // Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
    // Seconds part from the timestamp
    var seconds = "0" + date.getSeconds();
    // Will display time in 10:30:23 format
    var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return formattedTime;
}

const convertDegreeToCompassPoint = (wind_deg) => {
    const compassPoints = ["Nord", "Nord Nord Est", "Nord Est", "Est Nord Est", 
                           "Est", "Est Sud Est", "Sud Est", "Sud Sud Est",
                           "Sud", "Sud Sud Vest", "Sud Vest", "Vest Sud Vest", 
                           "Vest", "Vest Nord Vest", "Nord Vest", "Nord Nord Vest"];
    const rawPosition = Math.floor((wind_deg / 22.5) + 0.5);
    const arrayPosition = (rawPosition % 16);
    return compassPoints[arrayPosition];
  };

const apelareApi = (url) => {
    request.open("GET", url);
    request.send();
    request.onload = () => {
        if (request.status === 200 ) {
            jsonObject = JSON.parse(request.response);
            // console.log(request.response);
        }
        else {
            console.log(request.status);
        }
    }
}

const redesenareInterfata = () => {
    let nume_oras = jsonObject.name + ", " +  jsonObject.sys["country"];
    document.getElementById("oras").innerHTML = nume_oras;

    let descriereMare = jsonObject.weather[0]["main"];
    let img = document.getElementById("poza");
    if (descriereMare === "Rain") {
        img.src = "svg\\rain.svg";
        document.getElementById("garderoba").innerHTML = "Ar fi bine sa va luati o umbrela cu dumneavoastra.";
    }
    else if(descriereMare === "Clear") {
        img.src = "svg\\sun.svg";
        document.getElementById("garderoba").innerHTML = "Nu iti uita ochelarii de soare!";
    }
    else if(descriereMare === "Clouds") {
        img.src = "svg\\clouds.svg";
        document.getElementById("garderoba").innerHTML = "Fii precaut si asteapta-te la orice!"
    }
    else if(descriereMare === "Snow") {
        img.src = "svg\\rain.svg";
        document.getElementById("garderoba").innerHTML = "Fesul, caciula si manusile sunt neaparat necesare.";
    }
    else if(descriereMare === "Extreme") {
        img.src = "svg\\extreme-weather.svg";
        document.getElementById("garderoba").innerHTML = "Fii pregatit pentru sfarsitul lumii."
    }
    else if(descriereMare === "Thunderstorm") {
        img.src = "svg\\storm_good.svg";
        document.getElementById("garderoba").innerHTML = "Daca nu iti plac fulgerele, mai bine stai in casa :)"
    }
    else if(descriereMare === "Drizzle") {
        img.src = "svg\\drizzle.svg";
        document.getElementById("garderoba").innerHTML = "Se anunta burnita."
    }
    else if(descriereMare === "Mist") {
        img.src = "svg\\mist.svg";
        document.getElementById("garderoba").innerHTML = "Sa nu uiti de farurile pentru ceata!"
    }

    let descriere = jsonObject.weather[0]["description"];
    document.getElementById("descriere").innerHTML = descriere;

    temperaturaVarGlob = jsonObject.main["temp"];
    document.getElementById("grade").innerHTML = temperaturaVarGlob + " &#176;";

    let umiditate = jsonObject.main["humidity"];
    document.getElementById("umiditate").innerHTML = "Umiditate: " + umiditate + "%";

    let grade_vant = jsonObject.wind["deg"];
    let directie_vant = convertDegreeToCompassPoint(grade_vant);
    let viteza_vant = jsonObject.wind["speed"];
    document.getElementById("viteza_vant").innerHTML = "Directie vant: " + directie_vant;
    document.getElementById("directie_vant").innerHTML = "Viteza vant: " + viteza_vant + " m/sec";

    let ora_apus = jsonObject.sys["sunset"];
    let ora_rasarit = jsonObject.sys["sunrise"];
    let apus = convertorTimpUnix(ora_apus);
    let resarit = convertorTimpUnix(ora_rasarit);
    document.getElementById("apus").innerHTML = "Ora apus: " + apus;
    document.getElementById("rasarit").innerHTML = "Ora rasarit: " + resarit;
}


const proceseazaDate = (event) => {
    event.preventDefault();
    let date_intrare = document.getElementById("input_field").value;
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${date_intrare}&appid=3bcff5f73c4ebfc654b1ace455491869&lang=ro&units=metric`;

    apelareApi(url);
    redesenareInterfata();
    document.getElementById("buton").innerHTML = " Celsius";
}


const clickConversie = (event) => {
    // event.preventDefault();
    if (document.getElementById("buton").innerHTML === "Celsius") {
        let temp = temperaturaVarGlob;
        let grade_Fahrenheit = ((temp / 5) * 9) + 32;
        document.getElementById("grade").innerHTML = grade_Fahrenheit + " &#176;";
        document.getElementById("buton").innerHTML = "Fahrenheit";
    }
    else {
        document.getElementById("grade").innerHTML = temperaturaVarGlob + " &#176;";
        document.getElementById("buton").innerHTML = "Celsius";
    }    
}