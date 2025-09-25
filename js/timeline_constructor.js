"use strict";

async function main() {
    let response = await fetch("../timeline.csv");

    let table = timeline_parser(await response.text());

    let timeline = document.getElementById("timeline");

    let y = 0;

    for (let row of table) {
        let timeline_entry = document.createElement("div");
        timeline_entry.className = "timeline_entry";

        timeline_entry.style.top = 180 + y + "px";

        let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "40px");

        let circle = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );
        circle.setAttribute("cx", "20px");
        circle.setAttribute("cy", "20px");
        circle.setAttribute("r", "10px");

        let rect = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "rect"
        );
        rect.setAttribute("x", "20px");
        rect.setAttribute("y", "18px");
        rect.setAttribute("width", "50px");
        rect.setAttribute("height", "4px");

        svg.appendChild(circle);
        svg.appendChild(rect);

        let text = document.createElement("p");

        let bold_text = document.createElement("b");
        bold_text.innerText = row[0];

        text.appendChild(bold_text);
        text.appendChild(document.createTextNode(": " + row[1]));

        timeline_entry.appendChild(svg);
        timeline_entry.appendChild(text);

        timeline.appendChild(timeline_entry);

        y += 180;
    }
}

function parse_line(line) {
    let split_on_quotes = line.split(`"`);

    let entries = [];

    for (let i = 0; i < split_on_quotes.length; i += 2) {
        let split_on_commas = split_on_quotes[i].split(",");

        if (i !== 0) {
            entries[entries.length - 1] +=
                split_on_quotes[i - 1] + split_on_commas[0];

            split_on_commas.shift();
        }

        entries.push(...split_on_commas);
    }

    return entries;
}

function timeline_parser(raw_text) {
    let lines = raw_text.split("\n");

    let table = [];

    for (let line of lines) {
        let row = parse_line(line);

        table.push(row);
    }

    return table;
}

addEventListener("load", main);
