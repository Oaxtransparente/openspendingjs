/*jshint undef: true, browser:true, jquery: true, devel: true */
/*global Raphael, TWEEN, OpenSpendings */

/*
 * represents a bubble
 */
OpenSpendings.BubbleChart.Bubble = function(node, bubblechart, origin, radius, angle, colour) {

	var utils = OpenSpendings.BubbleChart.Utils;
	this.node = node;
	this.paper = bubblechart.paper;
	this.origin = origin;
	this.bc = bubblechart;
	this.rad = radius;
	this.angle = angle;
	this.colour = colour;
	this.dirty = true;
	this.bubbleRad = utils.amount2rad(this.node.data.amount);
	
	/*
	 * convertes polar coordinates to x,y
	 */
	this.getXY = function() {
		var me = this, o = me.origin, a = me.angle, r = me.rad;
		me.x = o.x + Math.cos(a) * r;
		me.y = o.y - Math.sin(a) * r;
	};
	
	this.init = function() {
		var me = this;
		me.getXY();
		me.circle = me.paper.circle(me.x, me.y, me.bubbleRad * me.bc.bubbleScale)
			.attr({ stroke: false, fill: me.colour });
		me.dirty = false;
		$(me.circle.node).click(me.onclick.bind(me));
		$(me.circle.node).css({ cursor: 'pointer'});
		
		var showIcon = false; //this.bubbleRad * this.bc.bubbleScale > 30;
		// create label
		this.label = me.paper.text(me.x, me.y + (showIcon ? me.bubbleRad * 0.4: 0), utils.formatNumber(me.node.data.amount)+'\n'+me.node.label)
			.attr({ 'font-family': 'Graublau,Georgia,serif', fill: '#fff', 'font-size': Math.max(4, me.bubbleRad * me.bc.bubbleScale * 0.25) });
		
		if (showIcon) {
			me.icon = me.paper.path("M17.081,4.065V3.137c0,0,0.104-0.872-0.881-0.872c-0.928,0-0.891,0.9-0.891,0.9v0.9C4.572,3.925,2.672,15.783,2.672,15.783c1.237-2.98,4.462-2.755,4.462-2.755c4.05,0,4.481,2.681,4.481,2.681c0.984-2.953,4.547-2.662,4.547-2.662c3.769,0,4.509,2.719,4.509,2.719s0.787-2.812,4.557-2.756c3.262,0,4.443,2.7,4.443,2.7v-0.058C29.672,4.348,17.081,4.065,17.081,4.065zM15.328,24.793c0,1.744-1.8,1.801-1.8,1.801c-1.885,0-1.8-1.801-1.8-1.801s0.028-0.928-0.872-0.928c-0.9,0-0.957,0.9-0.957,0.9c0,3.628,3.6,3.572,3.6,3.572c3.6,0,3.572-3.545,3.572-3.545V13.966h-1.744V24.793z")
				.translate(this.x, this.y).attr({fill: "#fff", stroke: "none"});
		}
		me.initialized = true;
	};
	
	this.onclick = function(e) {
		var me = this;
		me.bc.changeView(me.node.id);
	};
	
	this.draw = function() {
		var me = this, devnull = me.getXY(), ox = me.x, oy = me.y;
		me.circle.attr({ cx: me.x, cy: me.y, r: me.bubbleRad * me.bc.bubbleScale });
		me.label.attr({ x: me.x, y: me.y, 'font-size': Math.max(4, me.bubbleRad * me.bc.bubbleScale * 0.25) });
		if (me.icon) me.icon.translate(me.x - ox, me.y - oy);
	};
	
	this.remove = function() {
		var me = this;
		me.circle.remove();
		me.label.remove();
		me.initialized = false;
		if (me.icon) me.icon.remove();
	};
	
	this.init();
};