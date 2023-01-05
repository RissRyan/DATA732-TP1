/**
 * On crée la variable qui contiendra le nom du groupe de graphique du dashboard
 */
const groupName = "dataset";

/**
 * Fonction pour reset les filtres et redessiner les graphiques
 */
function reset() {
    dc.filterAll(groupName);
    dc.renderAll(groupName);
}

/**
 * Permet de montrer les % des tranches du pie chart
 * @param chart Le pie chart sur quoi faire la modification
 */
const montrerPourcentagesPieChart = (chart) => {
    chart.selectAll('text.pie-slice').text(function (d) {
        if (((d.endAngle - d.startAngle) / (2 * Math.PI) * 100) !== 0) {
            return dc.utils.printSingleValue(Math.round((d.endAngle - d.startAngle) / (2 * Math.PI) * 100)) + '%';
        }
    })
}

/**
 * La fonction pour créer la visualisation
 */
async function createDataViz() {

    // On récupère le dataset et on le met dans la variable dataset
    let dataset = await d3.csv("/data/survey.csv");

    // On formate un peu la donnée pour nous éviter des soucis
    dataset.forEach((d) => {

        d["While working"] = d["While working"] === "Yes";
        d["Instrumentalist"] = d["Instrumentalist"] === "Yes";
        d["Composer"] = d["Composer"] === "Yes";
        d["Exploratory"] = d["Exploratory"] === "Yes";
        d["Foreign languages"] = d["Foreign languages"] === "Yes";

        d["Age"] = +d["Age"];
        d["Hours per day"] = +d["Hours per day"];
        d["BPM"] = +d["BPM"];
        d["Anxiety"] = +d["Anxiety"];
        d["Depression"] = +d["Depression"];
        d["Insomnia"] = +d["Insomnia"];
        d["OCD"] = +d["OCD"];

        d["Timestamp"] = new Date(d["Timestamp"]);
    });


    console.log(dataset)

    hoursPerAge = {}

    dataset.forEach((e) => {
        const age = e["Age"]
        if(hoursPerAge[age] === undefined)
        {
            hoursPerAge[age] = []
        }
        
        hoursPerAge[age].push(e["Hours per day"])
    });
    const average = array => array.reduce((a, b) => a + b) / array.length;
    
    averageHourPerAge = []
    for (const [key, value] of Object.entries(hoursPerAge)) {
        averageHourPerAge.push({"Age": +key, "Avg": average(value)})
    }

    console.log(averageHourPerAge)

    dataset.forEach((d) => {

        averageHourPerAge.forEach((e) => {
            if(e["Age"] === d["Age"])
            {
                d["AvgHoursPerDay"] = e["Avg"];
            }
        })

    })

    console.log(dataset)

    // CHART HOURS PER DAY PER AGE
    const ndx = crossfilter(dataset)

    const ageDim = ndx.dimension(function (d) {
        return d["Age"];
    });

    // On crée le groupe, on veut le nombre de mass shooting par niveau scolaire
    const hourGroup = ageDim.group().reduce(reduceAdd, reduceRemove, reduceInitial);

    function reduceAdd(p, v) {
        ++p.count;
        p.total += v["Hours per day"];
        return p;
      }
      
      function reduceRemove(p, v) {
        --p.count;
        p.total -= v["Hours per day"];
        return p;
      }
      
      function reduceInitial() {
        return {count: 0, total: 0};
      }

    // On crée le graphique avec le groupName
    const hoursPerAgeChart = new dc.BarChart("#hoursPerAgeChart", groupName)
        .dimension(ageDim) // On ajoute la dimension
        .group(hourGroup) // On ajoute le groupe
        //.elasticX(true) // On veut que l'axe des X puisse redimensionner tout seul
        .ordering(function (p) { // On veut trier par valeur croissante
            return -p.value;
        })
        .valueAccessor(function(p) { return p.value.count > 0 ? p.value.total / p.value.count : 0; })
        .x(d3.scaleLinear().domain([0,100]))
        .y(d3.scaleLinear().domain([0,24]))

    // On veut rendre tous les graphiques qui proviennent du chart group "dataset"
    dc.renderAll(groupName);
}