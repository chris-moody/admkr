/*!
 * VERSION: 0.0.1
 * DATE: 2017-03-31
 * UPDATES AND DOCS AT: https://chris-moody.github.io/mkr
 *
 * @license copyright 2017 Christopher C. Moody
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy of
 *  this software and associated documentation files (the "Software"), to deal in the
 *  Software without restriction, including without limitation the rights to use, copy,
 *  modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
 *  and to permit persons to whom the Software is furnished to do so, subject to the
 *  following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 *  INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 *  PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 *  HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 *  OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 *  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 * @author: Christopher C. Moody, chris@moodydigital.com
 */

(function(global, className) {
	var _count=0, _instances = {};

	var prsm = function(options, parent) {
		this._id = _count;
		_count++;
		
		options = options || {};
		this._faceOffset = mkr.default(options.faceOffset, 0);
		parent = parent || document.body;
		var m = options.mkr || window.m;
		delete options.mkr;
    
		var faces = mkr.default(options.faces, []);
		faces[0] = mkr.default(faces[0], '#ff0000');
		faces[1] = mkr.default(faces[1], '#ffff00');
		faces[2] = mkr.default(faces[2], '#00ff00');
		faces[3] = mkr.default(faces[3], '#00ffff');
		faces[4] = mkr.default(faces[4], '#0000ff');
		faces[5] = mkr.default(faces[5], '#ff00ff');
    
		var W = this._width = mkr.default(options.width, 100);
		var H = this._height = mkr.default(options.height, 100);
		var D = this._depth = mkr.default(options.depth, 100);
		var offsetX = this._offsetX = (W-D)/2;
		var offsetY = this._offsetY = (H-D)/2;
    	this._debug = mkr.default(options.debug, false);
    
		delete options.width;
		delete options.height;
		delete options.depth, options.z;

		mkr.setDefault(options, 'container', {});
		mkr.setDefault(options.container, 'attr', {});
		mkr.setDefault(options.container.attr, 'class', 'prism');
		mkr.setDefault(options.container, 'css', {});
		mkr.setDefault(options.container.css, 'transformStyle', 'preserve-3d');

		var prism = m.create('div', options.container, parent);
		
		var gyro = m.create('div', {attr:{class:'gyro'}, css:{transformStyle:'preserve-3d'}}, prism);

		this._faces = [];

		this._faces.push(m.create('div', {attr:{class:'frt'}}, gyro));
			mkr.add(faces[this._faces.length-1], this._faces[this._faces.length-1]);
		this._faces.push(m.create('div', {attr:{class:'bck'}}, gyro));
			mkr.add(faces[this._faces.length-1], this._faces[this._faces.length-1]);
		this._faces.push(m.create('div', {attr:{class:'lft'}}, gyro));
			mkr.add(faces[this._faces.length-1], this._faces[this._faces.length-1]);
		this._faces.push(m.create('div', {attr:{class:'rgt'}}, gyro));
			mkr.add(faces[this._faces.length-1], this._faces[this._faces.length-1]);
		this._faces.push(m.create('div', {attr:{class:'top'}}, gyro));
			mkr.add(faces[this._faces.length-1], this._faces[this._faces.length-1]);
		this._faces.push(m.create('div', {attr:{class:'bot'}}, gyro));
			mkr.add(faces[this._faces.length-1], this._faces[this._faces.length-1]);

		this.redraw();

		_instances[this._id] = this;
	};

	prsm.prototype = {
		get width() { return this._width },
		set width(value) {
			this._width = value;
			this.redraw();
		},
		get height() { return this._height },
		set height(value) {
			this._height = value;
			this.redraw();
		},
		get depth() { return this._depth },
		set depth(value) {
			this._depth = value;
			this.redraw();
		},
	    /*get debug() { return this._debug },
			set debug(value) {
				this._debug = value;
	      if(value) {
	        TweenMax.set(this._faces[0], {text:'1'});
	        TweenMax.set(this._faces[1], {text:'2'});
	        TweenMax.set(this._faces[2], {text:'3'});
	        TweenMax.set(this._faces[3], {text:'4'});
	        TweenMax.set(this._faces[4], {text:'5'});
	        TweenMax.set(this._faces[5], {text:'6'});
	      }
	      else {
	        TweenMax.set(this._faces, {text:''});
	      }
		},*/
		get faces() { return this._faces },
		redraw: function() {
			var W = this._width, H = this._height, D = this._depth;
			this._offsetX = (W-D)/2;
			this._offsetY = (H-D)/2;

			//console.log(W, H, D, this._offsetX, this._offsetY);

			TweenMax.set(this._faces[0], {css:{width:W, height:H, x:-W/2, y:-H/2, z:D/2+this._faceOffset}});
			TweenMax.set(this._faces[1], {css:{width:W, height:H, x:-W/2, y:-H/2, z:-D/2-this._faceOffset, rotationY:180}});

			TweenMax.set(this._faces[2], {css:{width:D, height:H, x:-W+this._offsetX -this._faceOffset, y:-H/2, rotationY:270}});
			TweenMax.set(this._faces[3], {css:{width:D, height:H, x:0+this._offsetX +this._faceOffset, y:-H/2, rotationY:90}});

			TweenMax.set(this._faces[4], {css:{width:W, height:D, x:-W/2, y:0+this._offsetY +this._faceOffset, rotationX:270}});
			TweenMax.set(this._faces[5], {css:{width:W, height:D, x:-W/2, y:-H+this._offsetY -this._faceOffset, rotationX:90}});
      
      		//this.debug = this._debug;
		},
		setFace: function(n, background) {
			console.log(n, background);
			if(n < 0 || n > 5) return;
			TweenMax.set(this._faces[n], {css:{backgroundImage:background}});
		}
	};

	/**
    * @alias prsm.VERSION
    * @memberof prsm
    * @static
    * @readonly
    * @type String
    * @description returns prsm's version number
    **/
    Object.defineProperty(prsm, 'VERSION', {
        get: function() {
          return '0.0.1';
        }
    });

    if(typeof define === 'function' && define.amd){ //AMD
        define(function () { return prsm; });
    } else if (typeof module !== 'undefined' && module.exports){ //node
        module.exports = prsm;
    } else { //browser
        global[className] = prsm;
    }
})(mkr._constructs, 'prsm');