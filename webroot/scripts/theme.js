// Declare namespace
theme = {};

// Color schemes
theme.colors = {
	"Ruby Red": {
		"color-main": "#ff4c4c",
		"color-main-dark": "#ed2d2d",
		"color-main-light": "#ff7c7c"
	},
	"Sapphire Blue": {
		"color-main": "#0082d8",
		"color-main-dark": "#0065a8",
		"color-main-light": "#5cabe0"
	},
	"Amber Yellow": {
		"color-main": "#e5b106",
		"color-main-dark": "#e2a516",
		"color-main-light": "#f7cf40"
	},
	"Slate Grey": {
		"color-main": "#424242",
		"color-main-dark": "#333333",
		"color-main-light": "#898989"
	},
	"Amethyst Purple": {
		"color-main": "#9f18ba",
		"color-main-dark": "#7d1393",
		"color-main-light": "#c055d6"
	},
	"Emerald Green": {
	    "color-main": "#15af70",
	    "color-main-dark": "#0f9e60",
	    "color-main-light": "#1bd67e"
	}
};

// Dark and Light modes
theme.shades = {
	"Light": {
		"color-page-background": "#fcfcfc",
		"color-page-background-light": "#ffffff",
		"color-text": "#000000",
		"color-icon": "#000000",
		"color-textbox-border": "#b2b2b2"
	},
	"Dark": {
		"color-page-background": "#232323",
		"color-page-background-light": "#3f3f3f",
		"color-text": "#ffffff",
		"color-icon": "#ffffff",
		"color-textbox-border": "#000000"
	}
};

// Flat and Material modes
theme.styles = {
	"Material": {
		"box-shadow": "0px 2px 5px rgba(0,0,0,0.3)",
		"box-shadow-navbar": "0px 2px 5px rgba(0,0,0,0.2)",
		"box-shadow-navbar-item": "2px 0px 15px rgba(0,0,0,0.5), -2px 0px 15px rgba(0,0,0,0.5)",
		"border-radius": "0.6vh"
	},
	"Flat": {
		"box-shadow": "none",
		"box-shadow-navbar": "none",
		"box-shadow-navbar-item": "none",
		"border-radius": "0"
	}
};

// Sets the color aspect of theme in local storage and in css variables
theme.setColor = function(color) {
	if (color == null) {
		color = "Slate Grey";
	}
	
	localStorage.setItem("themeColor", color);
    document.body.style.setProperty("--theme-color-main", theme.colors[color]["color-main"]);
    document.body.style.setProperty("--theme-color-main-dark", theme.colors[color]["color-main-dark"]);
    document.body.style.setProperty("--theme-color-main-light", theme.colors[color]["color-main-light"]);
};

// Sets the shade aspect of theme in local storage and in css variables
theme.setShade = function(shade) {
	if (shade == null) {
		shade = "Light";
	}
	
	localStorage.setItem("themeShade", shade);
    document.body.style.setProperty("--theme-color-page-background", theme.shades[shade]["color-page-background"]);
	document.body.style.setProperty("--theme-color-page-background-light", theme.shades[shade]["color-page-background-light"]);
    document.body.style.setProperty("--theme-color-text", theme.shades[shade]["color-text"]);
	document.body.style.setProperty("--theme-color-icon", theme.shades[shade]["color-icon"]);
	document.body.style.setProperty("--theme-color-textbox-border", theme.shades[shade]["color-textbox-border"]);
};

// Sets the style aspect of theme in local storage and in css variables
theme.setStyle = function(style) {
	if (style == null) {
		style = "Material";
	}
	
	localStorage.setItem("themeStyle", style);
    document.body.style.setProperty("--theme-box-shadow", theme.styles[style]["box-shadow"]);
    document.body.style.setProperty("--theme-box-shadow-navbar", theme.styles[style]["box-shadow-navbar"]);
    document.body.style.setProperty("--theme-box-shadow-navbar-item", theme.styles[style]["box-shadow-navbar-item"]);
    document.body.style.setProperty("--theme-border-radius", theme.styles[style]["border-radius"]);
};

// Hilights the navbar item of the currently opened page in the navbar
theme.hilightNavbar = function() {
	// Gets the relative path of the current page being viewed
	var url = window.location.pathname.split("/");
	var page = url[url.length - 1];

	// Sets the class of chosen navbar item to "active" so that its color is different
	navbarItems = document.getElementById("navbar").children;
	if (page == "index.html") {
		navbarItems[0].className = "navbar-item active";
	}
	else if (page == "about_matrices.html") {
		navbarItems[1].className = "navbar-item active";
	}
	else if (page == "matrix_calculator.html") {
		navbarItems[2].className = "navbar-item active";
	}
	else if (page == "help.html") {
		navbarItems[3].className = "navbar-item active";
	}
	else if (page == "settings.html") {
		navbarItems[4].className = "navbar-item active";
	}
};