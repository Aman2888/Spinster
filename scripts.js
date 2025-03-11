// Fullscreen Toggle
document.getElementById("fullscreen-btn").addEventListener("click", function () {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
});

// Navbar Toggler
document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", function () {
        let navbar = document.querySelector("#navbarNav");
        if (navbar.classList.contains("show")) {
            new bootstrap.Collapse(navbar).hide();
        }
    });
});



// Hero Section
var padding = { top: 20, right: 40, bottom: 0, left: 0 },
    w = 700 - padding.left - padding.right,
    h = 700 - padding.top - padding.bottom,
    r = Math.min(w, h) / 2.2,
    rotation = 0,
    oldrotation = 0,
    picked = 100000,
    oldpick = [],
    color = d3.scale.ordinal().range([
        "#FF073A", "#FF7300", "#FFE600", "#32FF7E",
        "#18DCFF", "#7D5FFF", "#FC427B", "#D980FA",
        "#01CBC6", "#B33771"
    ]);
var data = [
    { "label": "Michael", "value": 1, "question": "What CSS property is used for specifying the area between the content and its border?" }, 
    { "label": "Jessica", "value": 2, "question": "What CSS property is used for changing the font?" }, 
    { "label": "David", "value": 3, "question": "What CSS property is used for changing the color of text?" }, 
    { "label": "Ashley", "value": 4, "question": "What CSS property is used for changing the boldness of text?" }, 
    { "label": "Christopher", "value": 5, "question": "What CSS property is used for changing the size of text?" }, 
    { "label": "Emily", "value": 6, "question": "What CSS property is used for changing the background color of a box?" }, 
    { "label": "Matthew", "value": 7, "question": "Which word is used for specifying an HTML tag that is inside another tag?" },
    { "label": "Madison", "value": 8, "question": "Which side of the box is the third number in: margin:1px 1px 1px 1px; ?" }, 
    { "label": "Joshua", "value": 9, "question": "What are the fonts that don't have serifs at the ends of letters called?" }, 
    { "label": "Sarah", "value": 10, "question": "With CSS selectors, what character prefix should one use to specify a class?" }
];

var svg = d3.select('#chart')
    .append("svg")
    .attr("width", w + padding.left + padding.right)
    .attr("height", h + padding.top + padding.bottom);

var container = svg.append("g")
    .attr("class", "chartholder")
    .attr("transform", "translate(" + (w / 2 + padding.left) + "," + (h / 2 + padding.top) + ")");

var vis = container.append("g");
var pie = d3.layout.pie().sort(null).value(() => 1);
var arc = d3.svg.arc().outerRadius(r);

var slices = vis.selectAll("g.slice")
    .data(pie(data))
    .enter()
    .append("g")
    .attr("class", "slice");

slices.append("path")
    .attr("fill", (d, i) => color(i))
    .attr("d", arc);

slices.append("text")
    .attr("transform", d => {
        d.innerRadius = 0;
        d.outerRadius = r;
        d.angle = (d.startAngle + d.endAngle) / 2;
        return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")translate(" + (d.outerRadius - 10) + ")";
    })
    .attr("text-anchor", "end")
    .text((d, i) => data[i].label)
    .style("font-size", "24px");

container.on("click", spin);

function spin() {
    if (oldpick.length == data.length) return;
    
    var ps = 360 / data.length;
    var rng = Math.floor((Math.random() * 1440) + 360);
    rotation = (Math.round(rng / ps) * ps);
    
    picked = Math.round(data.length - (rotation % 360) / ps);
    picked = picked >= data.length ? (picked % data.length) : picked;
    if (oldpick.includes(picked)) return spin();
    oldpick.push(picked);

    rotation += 90 - Math.round(ps / 2);
    vis.transition().duration(3000).attrTween("transform", rotTween).each("end", () => {
        showModal(data[picked].label, color(picked));
    });
}

function showModal(label, color) {
    var modal = document.getElementById("popup-modal");
    var modalText = document.getElementById("modal-text");
    if (modal && modalText) {
        modalText.textContent = label;
        modalText.style.color = color;
        modal.style.display = "block";
        document.querySelector(".close").onclick = () => modal.style.display = "none";
        window.onclick = event => { if (event.target == modal) modal.style.display = "none"; };
    }
}

svg.append("g")
    .attr("transform", "translate(" + (w + padding.left + padding.right - 50) + "," + ((h / 2) + padding.top) + ")")
    .append("path")
    .attr("d", "M-" + (r * .15) + ",0L0," + (r * .05) + "L0,-" + (r * .05) + "Z")
    .style({ "fill": "black" });

container.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 80)
    .style({ "fill": "white", "cursor": "pointer" });

container.append("text")
    .attr("x", 0)
    .attr("y", 15)
    .attr("text-anchor", "middle")
    .text("SPIN")
    .style({ "font-weight": "bold", "font-size": "35px" });

function rotTween() {
    var i = d3.interpolate(oldrotation % 360, rotation);
    return t => "rotate(" + i(t) + ")";
}

//make arrow
svg.append("g")
svg.append("g")
    .attr("transform", "translate(" + (w + padding.left + padding.right - 50) + "," + ((h / 2) + padding.top) + ")")
    .append("path")
    .attr("d", "M-" + (r * .15) + ",0L0," + (r * .05) + "L0,-" + (r * .05) + "Z")
    .style({ "fill": "black" });
//draw spin circle
container.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 80)
    .style({ "fill": "white", "cursor": "pointer" });
//spin text
container.append("text")
    .attr("x", 0)
    .attr("y", 15)
    .attr("text-anchor", "middle")
    .text("SPIN")
    .style({ "font-weight": "bold", "font-size": "35px" });


function rotTween(to) {
    var i = d3.interpolate(oldrotation % 360, rotation);
    return function (t) {
        return "rotate(" + i(t) + ")";
    };
}


function getRandomNumbers() {
    var array = new Uint16Array(1000);
    var scale = d3.scale.linear().range([360, 1440]).domain([0, 100000]);
    if (window.hasOwnProperty("crypto") && typeof window.crypto.getRandomValues === "function") {
        window.crypto.getRandomValues(array);
        console.log("works");
    } else {
        for (var i = 0; i < 1000; i++) {
            array[i] = Math.floor(Math.random() * 100000) + 1;
        }
    }
    return array;
}




// Drawer

document.getElementById('hideDrawer').addEventListener('change', function () {
    document.getElementById('drawerPanel').style.display = this.checked ? 'none' : 'block';
});

document.getElementById('shuffleBtn').addEventListener('click', function () {
    let list = document.getElementById('entriesList');
    let items = Array.from(list.children);
    items.sort(() => Math.random() - 0.5);
    list.innerHTML = '';
    items.forEach(item => list.appendChild(item));
});

document.getElementById('sortBtn').addEventListener('click', function () {
    let list = document.getElementById('entriesList');
    let items = Array.from(list.children);
    items.sort((a, b) => a.textContent.localeCompare(b.textContent));
    list.innerHTML = '';
    items.forEach(item => list.appendChild(item));
});




