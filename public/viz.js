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

    const ndx = crossfilter(dataset)

    ///
    /// CHART 1  --- HOURS PER DAY PER AGE
    ///

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
        .elasticX(true) // On veut que l'axe des X puisse redimensionner tout seul
        .ordering(function (p) { // On veut trier par valeur croissante
            return -p.value;
        })
        .yAxisLabel("Average hours per day")
        .xAxisLabel("Age")
        .valueAccessor(function(p) { return p.value.count > 0 ? p.value.total / p.value.count : 0; })
        .x(d3.scaleLinear().domain([10,100]))
        .y(d3.scaleLinear().domain([0,24]))


    ///
    /// CHART 2  --- BPM and ANXIETY
    ///

    const bpmDim = ndx.dimension(function (d) {
        return d["BPM"];
    });

    // On crée le groupe, on veut le nombre de mass shooting par niveau scolaire
    const anxietyGroup = bpmDim.group().reduce(reduceAdd2, reduceRemove2, reduceInitial2);

    function reduceAdd2(p, v) {
        ++p.count;
        p.total += v["Anxiety"];
        return p;
      }
      
      function reduceRemove2(p, v) {
        --p.count;
        p.total -= v["Anxiety"];
        return p;
      }
      
      function reduceInitial2() {
        return {count: 0, total: 0};
      }

    // On crée le graphique avec le groupName
    const bpmAnxietyGraph = new dc.BarChart("#bpmAnxietyChart", groupName)
        .dimension(bpmDim) // On ajoute la dimension
        .group(anxietyGroup) // On ajoute le groupe
        .ordering(function (p) { // On veut trier par valeur croissante
            return -p.value;
        })
        .yAxisLabel("Average anxiety")
        .xAxisLabel("BPM")
        .valueAccessor(function(p) { return p.value.count > 0 ? p.value.total / p.value.count : 0; })
        .x(d3.scaleLinear().domain([40,230]))
        .y(d3.scaleLinear().domain([0,10]))


        /* ===== DEPRESSION EN FONCTION DE L'AGE - ROW CHART ===== */
    
        const AgeDimension = ndx.dimension(function (d) {
            return d["Age"];
        });
    
        const depressionLevelGroup = AgeDimension.group().reduce(reduceAddDepression, reduceRemoveDepression, reduceInitialDepression);
    
        function reduceAddDepression(p, v) {
          ++p.count;
          p.total += v["Depression"];
          return p;
        }
        
        function reduceRemoveDepression(p, v) {
          --p.count;
          p.total -= v["Depression"];
          return p;
        }
        
        function reduceInitialDepression() {
          return {count: 0, total: 0};
        }
    
    
        // On crée le graphique avec le groupName
        const depressionLevelChart = new dc.BarChart("#depressionLevelChart", groupName)
            .dimension(AgeDimension) // On ajoute la dimension
            .group(depressionLevelGroup) // On ajoute le groupe
            //.ordinalColors(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"])
            .elasticX(true) // On veut que l'axe des X puisse redimensionner tout seul
            .ordering(function (p) { // On veut trier par valeur croissante
                return -p.value;
            })
            .yAxisLabel("Average depression")
            .xAxisLabel("Age")
            .valueAccessor(function(p) { return p.value.count > 0 ? p.value.total / p.value.count : 0; })
            .x(d3.scaleLinear().domain([0, 100]))
            .y(d3.scaleLinear().domain([0, 10]))
            ;
    
        // On veut mettre 4 ticks pour l'axe des X
        depressionLevelChart.xAxis().ticks(4)
    
        /* ===== FIN DEPRESSION EN FONCTION DE L'AGE - ROW CHART ===== */
    
    
        /* ===== ANXIETY EN FONCTION DE L'AGE - ROW CHART ===== */
    
        const anxietyLevelGroup = AgeDimension.group().reduce(reduceAddAnxiety, reduceRemoveAnxiety, reduceInitialAnxiety);
    
        function reduceAddAnxiety(p, v) {
          ++p.count;
          p.total += v["Anxiety"];
          return p;
        }
        
        function reduceRemoveAnxiety(p, v) {
          --p.count;
          p.total -= v["Anxiety"];
          return p;
        }
        
        function reduceInitialAnxiety() {
          return {count: 0, total: 0};
        }
    
    
        // On crée le graphique avec le groupName
        const anxietyLevelChart = new dc.BarChart("#anxietyLevelChart", groupName)
            .dimension(AgeDimension) // On ajoute la dimension
            .group(anxietyLevelGroup) // On ajoute le groupe
            .ordinalColors(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"])
            .elasticX(true) // On veut que l'axe des X puisse redimensionner tout seul
            .ordering(function (p) { // On veut trier par valeur croissante
                return -p.value;
            })
            .yAxisLabel("Average anxiety")
            .xAxisLabel("Age")
            .valueAccessor(function(p) { return p.value.count > 0 ? p.value.total / p.value.count : 0; })
            .x(d3.scaleLinear().domain([0, 100]))
            .y(d3.scaleLinear().domain([0, 10]))
            ;
    
        // On veut mettre 4 ticks pour l'axe des X
        anxietyLevelChart.xAxis().ticks(4)
    
        /* ===== FIN ANXIETE EN FONCTION DE L'AGE - ROW CHART ===== */

    // On veut rendre tous les graphiques qui proviennent du chart group "dataset"
    dc.renderAll(groupName);
}