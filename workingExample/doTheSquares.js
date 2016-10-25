// var margin = {top: 20, right: 120, bottom: 20, left: 120},
//     width = 960 - margin.right - margin.left,
//         height = 500 - margin.top - margin.bottom;
//
//         var i = 0;
//
//         var diagonal = d3.svg.diagonal()
//         .projection(function(d) { return [d.y, d.x]; });
//
//         var svg = d3.select("body").append("svg")
//         .attr("width", width + margin.right + margin.left)
//         .attr("height", height + margin.top + margin.bottom)
//         .append("g")
//         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var jsonRects = [
    { "x_axis": 30, "y_axis": 30, "piece_area_cm": 20, "color" : "green" },
    { "x_axis": 70, "y_axis": 70, "piece_area_cm": 20, "color" : "purple"},
    { "x_axis": 110, "y_axis": 100, "piece_area_cm": 20, "color" : "red"}];

    var artData = new Array();
    var heights = new Array();
    var widths = new Array();

    d3.json("firstThreeClean.json", function(error, data) {
        if (error) throw error;
        // artData = data;

        var index = 1;
        for (i in data) {
            instance = data[i];
            artData.push(instance);
            heights.push(instance["piece_height_mm"]);
            widths.push(instance["piece_width_mm"]);
            // if (instance["rental_year"] == "2006") {
            //     artData.push(instance);
            //     if (instance["semester"] == 1) {
            //         artData.push(instance);
            //         // console.log(instance["piece_title"]);
            //         // console.log(instance["rank"]);
            //     } else if (instance["semester"] == 2) {
            //         artData.push(instance);
            //     }
            //     // Push widths on regardless, to get absolute max
            //     widths.push(instance["piece_width_mm"]);
            // }
        }
        var svgContainer = d3.select("body").append("svg")
        .attr("width", 2900)
        .attr("height", 2900)

        var rects = svgContainer.selectAll("rect")
        .data(artData)
        .enter()
        .append("rect");

        var colorsDict = {
            2006 : {r : 0, g : 255, b : 0},
            2007 : {r : 0, g : 0, b :  255},
            2008 : {r : 255, g : 0, b :  0},
            2009 : {r : 150, g : 20, b :  147},
        };

        var length_dividend = 5;
        maxWidth = Math.max(...widths);
        maxHeight = Math.max(...heights);
        console.log("maxHeight is: " + maxHeight);

        function xFunction(d) {
            return (d.rank * (maxWidth / length_dividend));
            // return 100;
        }

        function yFunction(d) {
            // return (d.rental_year / 10) + (d.semester * 200) + Math.random() * 50;

            // Taking Least Significant digit (e.g. "6" in "2006"), to multiply by!
            // Code take from: http://stackoverflow.com/questions/4523131/get-the-number-of-n-digit-in-a-2-digit-number
            var year_lsd = Math.floor(d.rental_year / (Math.pow(10, 0)) % 10)

            // Commented out old stuff lol
            // // console.log("rental year: " + d.rental_year / 10) + (d.semester * 200)
            // // console.log("rental year part: " + year_lsd);
            // var pos = (d.rental_year / 10) + (d.semester * 200) + (year_lsd * 200);
            // // var pos = (d.rental_year / 10) + (d.semester * 200);
            // // console.log(pos/3);
            // pos = ((year_lsd * d.semester) / 10) * maxHeight;

            // TODO -ac Need to figure out how to space out the semesters one after each other
            // not, just downshift by 50 (e.g. d.semester * 50) ://///
            pos = (year_lsd * maxHeight / 10) + d.semester * 50;
            // pos = pos - 700;
            // pos = pos - 1500;
            console.log("y-position: " + pos);
            return pos;
            // return (d.rental_year / 10) + (d.semester * 200) + (year_lsd * 200) + Math.random()*50;
        }

        var rectAttributes = rects
        // .attr("cx", function (d) { return d.piece_width_mm; })
        // .attr("cy", function (d) { return d.piece_height_mm; })
        .attr("width", function (d) { return d.piece_width_mm / length_dividend})
        .attr("height", function (d) { return d.piece_height_mm / length_dividend})
        // .attr("r", function (d) { return d.piece_area_cm / 1000; })
        .attr("x", xFunction)
        .attr("y", yFunction)
        // .attr("r", function (d) { return 20; })
        // .style("fill", function(d) { return (d.piece_area_cm).toString(16); });
        .style("fill", function(d) {
            // var bModifier = d.rental_year / 10 + (d.rank * 50);
            var year_lsd = Math.floor(d.rental_year / (Math.pow(10, 0)) % 10)
            var modifier = (15 * year_lsd) + (maxHeight * d.semester);
            modifier = ((year_lsd * d.semester) / 10) * maxHeight;
            // console.log("year_lsd:" + (100 + (10 * year_lsd)));
            console.log("modifier: "+ modifier);
            console.log("step? : " + ((year_lsd * d.semester) / 10) * maxHeight + ", year: " + d.rental_year)
            return d3.color("rgba(50,"+ modifier +", 180, 0.35)"); // {r: 70, g: 130, b: 180, opacity: 1}
        })
        .on("click", function(d) {
            alert("You clicked on: " +
                 d.piece_title + "\n" +
                 "("+ d.rental_year+")");
        });

        var texts = svgContainer.selectAll("text")
        .data(artData)
        .enter()
        .append("text");

        var textAttributes = texts
        // .attr("x", function(d) { return d.rank * 100 })
        // .attr("y", function (d) { return (d.rental_year / 100) + 250 + Math.random() * 50; })
        .attr("x", function(d) {return xFunction(d)})
        .attr("y", function (d) { return yFunction(d) - 50})
        // .attr("y", function (d) { return yFunction(d) - 50 + (d.rank * 20)})
        // .attr("y", function (d) { return yFunction(d)})
        .attr("dy", "3em")
        .text(function(d) { return d.piece_title.slice(0,4) + "\" (" + d.rental_year + "." + d.semester + " " + d.rank + ")";});

    });


