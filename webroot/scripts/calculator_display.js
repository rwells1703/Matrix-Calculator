// Declare namespace
calculator_display = function ()
{
	var self = {};
	
	// Converts a Grid item into a latex string
	self.gridToLatex = function (grid)
	{
		var tex = "\\begin{bmatrix}";
		
		// Loop though each row and column of the grid
		var r = 0;
		while (r < grid.rows)
		{
			var c = 0;
			while (c < grid.columns)
			{
				// Convert the grid element to LaTeX and add it to final LaTeX string.
				tex += self.itemToLatex(grid.value[r][c]);
				
				// Add an & between elements, except the last element of each column
				if (c != grid.columns - 1)
				{
					tex += "&";
				}
				
				c += 1;
			}
			
			// Move onto a new line
			tex += "\\\\";
			
			r += 1;
		}
		
		tex += "\\end{bmatrix}";
		
		return tex;
	};
	
	// Converts any item into a latex string
	self.itemToLatex = function (item)
	{
		// Scalar, bracket and operation item
		if (item.type == "Scalar" || item.type == "Bracket" || item.type == "Operation")
		{
			return item.value;
		}
		// Grid items
		else if (item.type == "Matrix" || item.type == "Vector")
		{
			return self.gridToLatex(item);
		}
		
		return false;
	};
	
	// Displays the solution to the screen by adding an item underneath the canvas
	self.displaySolutionBelowGraph = function (solution, errorMessage)
	{
		if (solution == false)
		{
			// Display a red error message instead of a solution
			solutionWrapperText.style.color = "red";
			solutionWrapperText.innerHTML = errorMessage;
		}
		// Otherwise 
		else
		{
			// Generate the latex for the solution, and add this to the solution wrapper div
			var tex = "$" + self.itemToLatex(solution) + "$";
			solutionWrapperText.innerHTML = tex;
			solutionWrapperText.style.color = "var(--theme-color-text-background)";
		}
		
		// Re-render the MathJax on the page to show the solution
		MathJax.Hub.Typeset(solutionWrapper);
		
		return solutionWrapper;
	};
	
	// Displays all the 2 dimensional points from equation and solution as colored dots on the graph
	self.displayGridsOnGraph = function (equation, solution)
	{
		// Clears the canvas of all previously drawn points
		temporaryVertices = [];
		
		// Clones the solution object so that when the referenceItem is changed for the solution, the original items stay immutable.
		solution = Object.assign({}, solution);
		
		// If a solution has been provided, attempt to display it
		if (solution != undefined)
		{
			// Add the solution to the list of items in the equation, if the solution is a grid
			if (solution.type == "Matrix" || solution.type == "Vector")
			{
				solution.itemReference = solutionWrapper;
				equation.push(solution);
			}
		}
		
		// Declare two variables to hold the maximum x and y value of all points being drawn
		var xMax;
		var yMax;
		
		// An array of grids to be drawn to the canvas
		var grids = [];
		
		// Loop through every item in the equation
		var i = 0;
		while (i < equation.length)
		{
			if (equation[i].type == "Matrix" || equation[i].type == "Vector")
			{
				if (equation[i].rows == 2)
				{
					// Holds a refence to the grid item, along with the sets of 2d vertices to be drawn
					var grid = [];
					
					// A JS reference to the item/solution that the grid was created from
					var itemReference = equation[i].itemReference;
					grid.push(itemReference);
					
					// Only draw the points if the pointsVisible attribute is true (toggled by clicking on the colorIndicator)
					if (grid[0].getAttribute("pointsVisible") == "true")
					{
						var c = 0;
						while (c < equation[i].columns)
						{
							// Plots the point to the canvas
							var x = equation[i].value[0][c].value;
							var y = equation[i].value[1][c].value;
							
							// If the magnitude of the current x value is larger than the maximum x value
							if (Math.abs(x) > xMax || xMax == undefined)
							{
								// Replace the maximum x value with the current one
								// Need Math.abs to make it positive
								xMax = Math.abs(x);
							}
							
							// If the magnitude of the current y value is larger than the maximum y value
							if (Math.abs(y) > yMax || yMax == undefined)
							{
								// Replace the maximum y value with the current one
								// Need Math.abs to make it positive
								yMax = Math.abs(y);
							}
							
							// Add this pair of points to the points array
							grid.push([x,y]);
							
							// Move onto the next column (next vertice)
							c += 1;
						}	
					}
					
					// Add this set of points to the grid array
					grids.push(grid);
				}
			}
			
			// Continue to the next equation item
			i += 1;
		}
		
		// Round maximums up to the nearest integer
		// This makes the graph labels smaller and easier to read
		xMax = Math.ceil(xMax);
		yMax = Math.ceil(yMax);
		
		// Change axis maximums that are 0 to 1, as points on 0 length axes are not drawn at all.
		if (xMax == 0)
		{
			xMax = 1;
		}
		if (yMax == 0)
		{
			yMax = 1;
		}
	
		// If grids were parsed, add axes labels
		if (grids.length != 0)
		{
			xMinLabel.innerHTML = -xMax;
			xMinHalfLabel.innerHTML = -xMax/2;
			xMaxLabel.innerHTML = xMax;
			xMaxHalfLabel.innerHTML = xMax/2;
			yMinLabel.innerHTML = -yMax;
			yMinHalfLabel.innerHTML = -yMax/2;
			yMaxLabel.innerHTML = yMax;
			yMaxHalfLabel.innerHTML = yMax/2;
		}
		else
		{	
			// If the equation was not parsed correctly, we must clear all the old colorIndicator colors
			var allColorIndicators = document.getElementsByClassName("colorIndicator");
			
			// Loop through every color indicator
			var i = 0;
			while (i < allColorIndicators.length)
			{
				// Clear its background color
				allColorIndicators[i].style.backgroundColor = "";

				// Move onto the next color indicator
				i += 1;
			}
		}
		
		// If there were no axis limits set, all the points must be hidden so do not display any axis labels
		if (isNaN(xMax) || isNaN(yMax))
		{
			xMinLabel.innerHTML = "";
			xMinHalfLabel.innerHTML = "";
			xMaxLabel.innerHTML = "";
			xMaxHalfLabel.innerHTML = "";
			yMinLabel.innerHTML = "";
			yMinHalfLabel.innerHTML = "";
			yMaxLabel.innerHTML = "";
			yMaxHalfLabel.innerHTML = "";
		};
		
		// Loop through the list of grids and their points (generated above)
		var g = 0;
		while (g < grids.length)
		{
			// Generates a seed based on the amount of grids and the location of the current grid within this list
			var seed = (g * 2 * Math.PI) / grids.length;
			
			// Generates red, green and blue values using sinusoidal waves
			// This is so that all sets of points are different colors
			// These colors correspond to positions on the sine wave

			// Red color offset by 0 radians
			var red = 255 * Math.sin(seed);
			if (red < 0)
			{
				red = 0;
			}

			// Green color offset by pi/2 radians
			var green = 255 * Math.sin(seed + (Math.PI / 2));
			if (green < 0)
			{
				green = 0;
			}

			// Blue color offset by pi radians
			var blue = 255 * Math.sin(seed + Math.PI);
			if (blue < 0)
			{
				blue = 0;
			}
			
			// Gets the grid info
			var grid = grids[g];
			
			// Get a DOM refernce to the color indicator of the current grid
			var colorIndicator = grid[0].getElementsByClassName("colorIndicator")[0];

			// Set the CSS background of the color indicator to the new unique color
			colorIndicator.style.backgroundColor = "rgba("+red+","+green+","+blue+")";
			
			// Loop through each vertice in the current grid
			var i = 1;
			while (i < grid.length)
			{
				// Takes the x and y values, and converts them so that they are between -1 and 1
				var xRelative = axisWidth * grid[i][0] / (xMax);
				var yRelative = axisWidth * grid[i][1] / (yMax);

				// Create a circular point on the canvas with the correct position and color
				calculator_canvas.createPolygon([xRelative, yRelative], 10, 0.03, [red/255, green/255, blue/255, 255/255], false);
				
				// Move onto the next vertice
				i += 1;
			}
			
			// Continue to the next grid that needs to be drawn
			g += 1;
		}
	};
	
	return self;
}();