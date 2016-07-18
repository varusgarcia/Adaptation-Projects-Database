var iconDim = 20;



var varSectorHidden = false;
var varImpactHidden = false;
var varStimulusHidden = false;

var SectorDomain = ["Agriculture", "Coast", "Forestry", "Water", "City"];
var ImpactDomain = ["Increased forest fire frequency", "Agricultural GDP loss", "Agricultural production loss", "Rainfed agricultural production loss", "Irrigated agricultural production loss", "Soil moisture reduction", "Wetland loss", "Water stock reduction", "Urban water supply decrease", "Rural and urban area damages", "Land loss", "Land-cover conversion", "Food loss", "Livestock production decrease", "Migration", "Relocation", "Other impacts"];
var StimulusDomain = ["Sea-Level rise", "Precipitation", "Temperature", "Drought", "Hydrological drought", "Meterological drought"];

var sectorScale = d3.scale.ordinal()
    .domain(SectorDomain)
    .range(["#0CD381", "#85A2C7", "#FFCC00", "#0C55B0", "#853709"]);
var impactScale = d3.scale.ordinal()
    .domain(ImpactDomain)
    .range(["#FFCA0A", "#22890A", "#33B813", "#3CDE15", "#4DF425", "#0C55B0", "#186EDA", "#2D81EA", "#4E9BFB", "#853709", "#D45E19", "#E78B56", "#830A90", "#AE0CBF", "#868008", "#D5CD25", "#A3A3A3"]);
var stimulusScale = d3.scale.ordinal()
    .domain(StimulusDomain)
    .range(["#5FA0D6", "#7171D9", "#FFCC00", "#DD721E", "#E18A45", "#E8A46F"]);




//  var margin = {top: 200, right: 200, bottom: 300, left: 400},
//    width = 960 - margin.left - margin.right,
//  height = 500 - margin.top - margin.bottom;
var zoom = d3.behavior.zoom()
    .scaleExtent([2, 40])
    .on("zoom", move);





var sectorPosScale = d3.scale.linear()
    .domain([1, 5])
    .range([0, width]);


var browserHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
var browserWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

var sideBarWidth = browserWidth * 0.1,
    sideBarHeight = browserHeight - sideBarWidth,
    bottomBarHeight = sideBarWidth,
    bottomBarWidth = browserWidth;

var width = browserWidth - 2 * sideBarWidth,
    height = browserHeight - bottomBarHeight;


var impactLength = 0;
var sectorLength = 0;
var stimulusLength = 0;




var projection = d3.geo.mercator()
    .center([0, 50])
    .scale(100)
    .rotate([30, 0]);

var path = d3.geo.path()
    .projection(projection);



var ImpactsSvg = d3.select(".Impacts").append("svg")
    .attr("id", "Impacts")
    .attr("width", sideBarWidth)
    .attr("height", sideBarHeight);

var svg = d3.select(".mapMaster").append("svg")
    .attr("id", "SVGvis")
    .attr("width", width - 8)
    .attr("height", height);

var StimulusSvg = d3.select(".Stimulus").append("svg")
    .attr("id", "Stimulus")
    .attr("width", sideBarWidth)
    .attr("height", sideBarHeight);

var SectorSvg = d3.select(".Sectors").append("svg")
    .attr("id", "Sectors")
    .attr("width", bottomBarWidth)
    .attr("height", bottomBarHeight);


var g = svg.append("g").attr("class", "test");
var mapG = g.append("g")
    .attr("class", "Map");



ImpactDomain.forEach(function(e, i) {
    var ImpactG = ImpactsSvg.append("g")
        .attr("transform", function(e) {
            return "translate(" + iconDim + ", " + (sideBarHeight / ImpactDomain.length) * (i + 0.5) + ")";
        })
        .attr("id", e.replace(/ /g, '-'))
        .on("click", function(e) {
            if (varImpactHidden == false) {
                var selectClass = d3.select(this).attr("id")
                removeIcon(selectClass)
                d3.select(this).classed("selectedSideBar", true);
                varImpactHidden = true;
            } else {
                d3.selectAll(".hidden").classed("hidden", false)
                varImpactHidden = false;
                d3.selectAll(".selectedSideBar").classed("selectedSideBar", false);
            }

            barChartUpdate()
        });

    ImpactG.append("rect")
        .data(e)
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", function(d) {
            return impactScale(i);
        });

    ImpactG.append("text")
        .attr("x", 0)
        .attr("y", -10)
        .text(e)
        .attr("fill", "white")
        .attr("font-size", "11px");
})

StimulusDomain.forEach(function(e, i) {
    var StimulusG = StimulusSvg.append("g")
        .attr("transform", function(e) {
            return "translate(" + (sideBarWidth-iconDim*2) + ", " + (sideBarHeight / StimulusDomain.length) * (i + 0.5) + ")";
        })
        .attr("id", e.replace(/ /g, '-'))
        .on("click", function(e) {


            if (varStimulusHidden == false) {
                var selectClass = d3.select(this).attr("id")
                removeIcon(selectClass)
                varStimulusHidden = true;
                d3.select(this).classed("selectedSideBar", true);

            } else {
                d3.selectAll(".hidden").classed("hidden", false)
                varStimulusHidden = false;
                d3.selectAll(".selectedSideBar").classed("selectedSideBar", false);

            }
            barChartUpdate()

        })


    StimulusG.append("rect")
        .data(e)
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", iconDim)
        .attr("height", iconDim)
        .style("fill", function(d) {
            return stimulusScale(i);
        });

    StimulusG.append("text")
        .attr("x", 0)
        .attr("y", -10)
        .text(e)
        .attr("font-size", "11px")
        .attr("fill", "white")
        .style("text-anchor", "end")
        .attr("transform", "translate(" + 20+ "," +0+ ")");
})

SectorDomain.forEach(function(e, i) {
    var SectorG = SectorSvg.append("g")
        .attr("transform", function(e) {
            return "translate(" + (((browserWidth) / SectorDomain.length) * (i * 0.8) + browserWidth * 0.17) + ", " + (sideBarWidth-iconDim*2) + ")";
        })
        .attr("id", e.replace(/ /g, '-'))
        .data(e)
        .on("click", function(e) {


            if (varSectorHidden == false) {
                var selectClass = d3.select(this).attr("id")
                removeIcon(selectClass)
                varSectorHidden = true;
                d3.select(this).classed("selectedSideBar", true);

            } else {
                d3.selectAll(".hidden").classed("hidden", false)
                varSectorHidden = false;
                d3.selectAll(".selectedSideBar").classed("selectedSideBar", false);

            }
            barChartUpdate()

        });

    SectorG.append("rect")
        .data(e)
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", function(d) {
            return sectorScale(i);
        })


    SectorG.append("text")
        .attr("x", 0)
        .attr("y", 30)
        .text(e)
        .attr("fill", "white")
        .attr("font-size", "11px")
        .attr("transform", "translate(" + -40+ "," +20+ ") rotate(-90) ");
})


function removeIcon(d) {
    svg.selectAll(".test g:not(." + d + "):not(.Impact):not(.Map):not(.Stimulus):not(.Sector)").classed("hidden", true);
}


d3.json("world-110m2.json", function(error, topology) {
    mapG.selectAll("path")
        .data(topojson.object(topology, topology.objects.countries).geometries)
        .enter()
        .append("path")
        .attr("d", path);
});

queue()
    .defer(d3.json, 'Targets.json')
    .defer(d3.json, 'Adaptations.json')
    .await(makeLayout);

function makeLayout(error, targetsData, adaptationsData) {



    var Targets = targetsData.Targets;
    var Adaptations = adaptationsData.Adaptations;


    Targets.forEach(function(e, i) {

        var iconG = g
            .append("g")
            .attr('class', function(d) {
                var ImpactToString = e.Impact.toString().replace(/ /g, '-').replace(/,/g, ' ');
                var SectorToString = e.Sector.toString().replace(/ /g, '-').replace(/,/g, ' ');
                var StimulusToString = e.Stimulus.toString().replace(/ /g, '-').replace(/,/g, ' ');
                return ("IconGroup " + ImpactToString + " " + SectorToString + " " + StimulusToString);
            })
            .attr('id', e.adaptation_id)
            .data(Targets)
            .on("mouseover", function(d) {
                var selectedId = d3.select(this).attr("id")
                Targets.forEach(function(e, i) {
                    if (e.adaptation_id == selectedId) {
                        selectedTitles(Targets[i])
                    }
                })
            })
            .on("mouseout", function() {
                d3.selectAll(".selected").classed("selected", false)
            });

        iconG.append("g")
            .attr("class", "Impact");

        for (var i = 0; i < e.Impact.length; i++) {
            impactLength = e.Impact.length;
            iconG.select(".Impact")
                .append("rect")
                .data(e.Impact)
                .attr("x", 0)
                .attr("y", function(d) {
                    return (iconDim / impactLength) * i;
                })
                .attr("width", iconDim * 0.2)
                .attr("height", function(d) {
                    return (iconDim / impactLength)
                })
                .style("fill", function(d) {
                    return impactScale(e.Impact[i]);
                })
                .attr("transform", "translate(" + ((iconDim / 2) * -1) + "," + ((iconDim / 2) * -1) + ")");
        }

        iconG.append("g")
            .attr("class", "Sector");

        for (i = 0; i < e.Sector.length; i++) {
            sectorLength = e.Sector.length;
            iconG.select(".Sector").append("rect")
                .data(e.Sector)
                .attr("x", function(d) {
                    return ((iconDim / 2) / sectorLength) * i + (iconDim / 3.3);
                })
                .attr("y", iconDim * 0.6)
                .attr("width", function(d) {
                    return ((iconDim / 2) / sectorLength)
                })
                .attr("height", iconDim * 0.4)
                .style("fill", function(d) {
                    return sectorScale(e.Sector[i]);

                })
                .attr("transform", "translate(" + ((iconDim / 2) * -1) + "," + ((iconDim / 2) * -1) + ")");


        }
        iconG.append("g")
            .attr("class", "Stimulus");
        for (i = 0; i < e.Stimulus.length; i++) {

            stimulusLength = e.Stimulus.length;
            iconG.select(".Stimulus")
                .append("rect")
                .data(e.Stimulus)
                .attr("x", (iconDim * 0.9))
                .attr("y", function(d) {
                    return (iconDim / stimulusLength) * i
                })
                .attr("width", iconDim * 0.2)
                .attr("height", function(d) {
                    return (iconDim / stimulusLength)
                })
                .style("fill", function(d) {
                    return stimulusScale(e.Stimulus[i]);
                })
                .attr("transform", "translate(" + ((iconDim / 2) * -1) + "," + ((iconDim / 2) * -1) + ")");
        }

        iconG.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", iconDim + (iconDim * 0.1))
            .attr("height", iconDim * 2)
            .style("fill", "rgba(255,255,255,0)")
            .attr("transform", "translate(" + ((iconDim / 2) * -1) + "," + ((iconDim / 2) * -1) + ")");


    });


    svg.selectAll(".IconGroup")
        .attr("transform", function(d, i) {
            return "translate(" + projection([Adaptations[i].lng, Adaptations[i].lat])[0] + "," + projection([Adaptations[i].lng, Adaptations[i].lat])[1] + "), scale(" + (1) + ")";
        });



    SectorDomain.forEach(function(e, i) {
        d3.select("#" + e.replace(/ /g, '-'))
            .data(e.replace(/ /g, '-'))
            .append("rect")
            .attr("x", 0)
            .attr("y",function(d) {
                return ((d3.selectAll("." + e.replace(/ /g, '-')+ ":not(.hidden)").size() / 4) * -1)-5
            })
            .attr("width", iconDim)
            .attr("height", function(d) {
                return d3.selectAll("." + e.replace(/ /g, '-')+ ":not(.hidden)").size() / 4
            })
            .attr("transform", "translate(" + 0 + "," + 0 + ")")
            .style("fill", function(d) {
                return sectorScale(e);
            })
            .attr("class", "barChart");
    })

    StimulusDomain.forEach(function(e, i) {
        d3.select("#" + e.replace(/ /g, '-'))
            .data(e.replace(/ /g, '-'))
            .append("rect")
            .attr("x", function(d) {
                return ((d3.selectAll("." + e.replace(/ /g, '-')+ ":not(.hidden)").size() / 4) * -1)-5
            })
            .attr("y", 0)
            .attr("height", iconDim)
            .attr("width", function(d) {
                return (d3.selectAll("." + e.replace(/ /g, '-')+ ":not(.hidden)").size() / 4)
            })
            .attr("transform", "translate(" + 0 + "," + 0 + ")")
            .style("fill", function(d) {

                return stimulusScale(e);
            })
            .attr("class", "barChart");
    })

    ImpactDomain.forEach(function(e, i) {
        d3.select("#" + e.replace(/ /g, '-'))
            .data(e.replace(/ /g, '-'))
            .append("rect")
            .attr("x", 5)
            .attr("y", 0)
            .attr("height", iconDim )
            .attr("width", function(d) {
                return d3.selectAll("." + e.replace(/ /g, '-')+ ":not(.hidden)").size() / 4
            })
            .attr("transform", "translate(" + iconDim + "," + 0 + ")")
            .style("fill", function(d) {
                return impactScale(e);
            })
            .attr("class", "barChart");
    })

}

function barChartUpdate() {
    SectorDomain.forEach(function(e) {
        d3.select("#" + e.replace(/ /g, '-'))
        .select(".barChart")
        .transition()
        .duration(300)
        .attr("y",function(d) {
            return ((d3.selectAll("." + e.replace(/ /g, '-')+ ":not(.hidden)").size() / 4) * -1)-5
        })
        .attr("height",function(d) {
            return d3.selectAll("." + e.replace(/ /g, '-')+ ":not(.hidden)").size() / 4
        })
    })
    ImpactDomain.forEach(function(e) {

        d3.selectAll("#" + e.replace(/ /g, '-'))
        .selectAll(".barChart")
        .transition()
        .duration(300)
        .attr("width",function() {
          //console.log(r);
          //
            return d3.selectAll("." + e.replace(/ /g, '-')+ ":not(.hidden)").size() /4
        })
    })
    StimulusDomain.forEach(function(e) {
        d3.select("#" + e.replace(/ /g, '-'))
        .select(".barChart")
        .transition()
        .duration(300)
        .attr("x", function(d) {
          console.log(d3.selectAll("." + e.replace(/ /g, '-')).size());

            return ((d3.selectAll("." + e.replace(/ /g, '-')+ ":not(.hidden)").size() / 4) * -1)-5
        })
        .attr("width",function(d) {
            return d3.selectAll("." + e.replace(/ /g, '-')+ ":not(.hidden)").size() / 4
        });
    })
}

function selectedTitles(d) {
    d.Impact.forEach(function(e, i) {
        d3.selectAll("#" + e.replace(/ /g, '-')).classed("selected", true);
    })

    d.Sector.forEach(function(e, i) {
        d3.selectAll("#" + e.replace(/ /g, '-')).classed("selected", true);
    })

    d.Stimulus.forEach(function(e, i) {
        d3.selectAll("#" + e.replace(/ /g, '-')).classed("selected", true);
    })

}


function move() {

    svg.select(".test").attr("transform", "translate(" + d3.event.translate.join(",") + "), scale(" + d3.event.scale + ")");

    g.selectAll(".IconGroup").attr("transform", function() {
        return "translate(" + d3.transform(d3.select(this).attr("transform")).translate + "), scale(" + (1 / d3.event.scale) + ")"
    });

    g.selectAll("path")
        .attr("d", path.projection(projection));


    var t = d3.event.translate;
    var s = d3.event.scale;

    var h = height / 20;


    t[0] = Math.min((width / height) * (s - 1), Math.max(width * (1 - s), t[0]));

    t[1] = Math.min(
        h * (s - 1) + h * s,
        Math.max(height * (1 - s) - h * s, t[1])
    );

    zoom.translate(t);
    g.attr("transform", "translate(" + t + ")scale(" + s + ")");


}
svg.call(zoom);
