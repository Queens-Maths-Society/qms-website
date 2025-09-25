"use strict";

async function main() {
    let response = await fetch("../events.csv");

    let table = event_parser(await response.text());

    let upcoming_events_list = document.getElementById("upcoming_events_list");
    let past_events_list = document.getElementById("past_events_list");

    for (let row of table) {
        let event_div = document.createElement("div");
        event_div.className = "event_box";

        let colour_box = document.createElement("div");
        colour_box.className = "colour_box";
        colour_box.style.backgroundColor = row[1];

        let event_name = document.createElement("h1");
        event_name.className = "event_name";
        event_name.innerText = row[2];

        let event_date = document.createElement("h2");
        event_date.className = "event_date";
        if (row[0] === "TBC") {
            event_date.innerText = row[0];
        } else {
            event_date.innerText =
                row[0].getDate() +
                " " +
                row[0].toLocaleString("en-GB", {
                    month: "long",
                }) +
                " " +
                row[0].getFullYear();

            row[0].setDate(row[0].getDate() + 1);
        }

        let event_description = document.createElement("p");
        event_description.className = "event_description";
        event_description.innerText = row[3];

        event_div.appendChild(colour_box);
        event_div.appendChild(event_name);
        event_div.appendChild(event_date);
        event_div.appendChild(event_description);

        if (row[0] === "TBC" || row[0] > Date.now()) {
            upcoming_events_list.appendChild(event_div);
        } else {
            past_events_list.appendChild(event_div);
        }
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

function event_parser(raw_text) {
    let lines = raw_text.split("\n");

    let table = [];

    for (let line of lines) {
        let row = parse_line(line);

        let date = new Date(row[0]);

        if (!isNaN(date.getDate())) {
            row[0] = date;
        }

        table.push(row);
    }

    return table;
}

addEventListener("load", main);
