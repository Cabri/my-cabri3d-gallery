const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

module.exports = function(eleventyConfig) {
	eleventyConfig.addPlugin(eleventyNavigationPlugin);
	eleventyConfig.addPassthroughCopy("src/css");
	eleventyConfig.addPassthroughCopy("src/players");
	eleventyConfig.addPassthroughCopy("src/img");
	eleventyConfig.addPassthroughCopy("src/js/cg3Display.js");

	return {
		dir: {
			input: "src"
		}
	}
};
