//, summarizebyunit

define(["dojo/_base/declare","dijit/_WidgetBase", "dijit/_TemplatedMixin", "dojo/text!./templates/prtrack.html", "dojo/dom-style", "dojo/dom-class", "dojo/_base/fx", "dojo/_base/kernel", "dojo/_base/lang", "dojo/on", "dojo/mouse", "dojo/query", "dojo/store/Memory", "dijit/form/ComboBox", "dijit/form/DropDownButton", "dijit/DropDownMenu", "dijit/MenuItem", "dojo/dom", "dojo/parser", "dojo/query", "dijit/registry", "dijit/layout/TabContainer", "dijit/layout/ContentPane", "dojo/dom-construct", "dijit/form/Button", "dijit/CheckedMenuItem", "dojo/_base/array", "dgrid/Grid", "dojo/store/Memory", "dgrid/OnDemandGrid", "dgrid/extensions/ColumnResizer","dojo/dom-geometry", "dojox/layout/FloatingPane", "esri/dijit/Legend", "dojo/window", "dgrid/util/touch", "dgrid/Selection", "dgrid/extensions/ColumnHider", "esri/layers/ArcGISDynamicMapServiceLayer", "esri/layers/FeatureLayer", "dojo/io-query", "dojo/currency"],
    function(declare, WidgetBase, TemplatedMixin, template, domStyle, domClass, baseFx, dojo, lang, on, mouse, query, Memory, ComboBox, DropDownButton, DropDownMenu, MenuItem, dom, parser, dq, registry, TabContainer, ContentPane, domConstruct, Button, CheckedMenuItem, array, Grid, Memory, OnDemandGrid, ColumnResizer, domGeom, FloatingPane, Legend, win, touchUtil, Selection, ColumnHider, ArcGISDynamicMapServiceLayer, FeatureLayer, ioQuery, localeCurrency){
        return declare([WidgetBase, TemplatedMixin], {
            // Some default values for our author
            // These typically map to whatever you're handing into the constructor
            name: "No Name",
            // Using require.toUrl, we can get a path to our AuthorWidget's space
            // and we want to have a default avatar, just in case
            //avatar: require.toUrl("custom/AuthorWidget/images/defaultAvatar.png"),
            bio: "",
 
            // Our template - important!
            templateString: template,
 
            // A class to be applied to the root node in our template
            baseClass: "StatsPanel",
 
            // A reference to our background animation
            mouseAnim: null,
            
            inputLayer: null,
			
			firstload: true,
            
            toolbar: null,
        
            currentlevel : 2,
            
            expanded: true,
            
            outputid: "",
			
			ft: true,
			
            
            destroy: function(){
            	   	
				this.inherited(arguments);
            	
            },
            
            
            postCreate: function(){
			    // Get a DOM node reference for the root of our widget
			    var domNode = this.domNode;
			   
			 
			    // Run any parent postCreate processes - can be done at any point
			    this.inherited(arguments);  


		   },
		   
		   startup: function() {
		   
		    thing = this;
		    

		  		 parser.parse();

		    	inq = window.location.search.substring(1), true;
		
				pageParameters = ioQuery.queryToObject(inq);
				
				if (pageParameters.level == undefined) {pageParameters.level = 2}
				
				console.log(pageParameters)
		
			
		
				 
				   this.clearButton = new Button({
            label: "Clear Selection",
            onClick: lang.hitch(this,this.clearall)
        }, "Cselect");
        
		
		DDlabs = {1: "Entire Great Lakes Basin", 2: "Individual Lake Drainage Basins", 3: "Subwatersheds"}
		
        var menu2 = new DropDownMenu({ style: "display: none;"});
        var menuItem12 = new MenuItem({
            label: "Entire Great Lakes Basin",
            onClick: lang.hitch(this,this.changelevel, 1, DDlabs[1])
        });
        menu2.addChild(menuItem12);

        var menuItem22 = new MenuItem({
            label: "Individual Lake Drainage Basins",
            onClick: lang.hitch(this,this.changelevel, 2, DDlabs[2])
            
        });
        menu2.addChild(menuItem22);
        
        var menuItem23 = new MenuItem({
            label: "Subwatersheds",
            onClick: lang.hitch(this,this.changelevel, 3, DDlabs[3])
        });
        menu2.addChild(menuItem23);

        var button2 = new DropDownButton({
            label: DDlabs[pageParameters.level],
            name: "programmatic2",
            dropDown: menu2,
            id: "LevelButton"
        });
        dom.byId("LSelect").appendChild(button2.domNode);
				 
		 allchecks = dq(".taxaCheck");
		 
		 array.forEach(allchecks, lang.hitch(this,function(entry, i) {
		 
				mywidget = registry.byNode(entry);
				a = mywidget.get("value");
				
				if (pageParameters.taxa != undefined) {
					taxa = pageParameters.taxa.split(",");
					for (i in taxa) {
				
					t = taxa[i]
					if (a == t) {
					
						mywidget.set("checked", true);
					
					}
				
			
					}
				}
		 
				
				on(mywidget, "change", lang.hitch(this,this.restrictGeography));
			}));

		 allchecks = dq(".logicCheck");
		 
		 array.forEach(allchecks, lang.hitch(this,function(entry, i) {
				mywidget = registry.byNode(entry);
				on(mywidget, "change", lang.hitch(this,this.restrictGeography));
			}));			
		 
	
		

			 this.map.reposition();
			 
			 this.inherited(arguments);
			 
		
			
		this.maplayer = new ArcGISDynamicMapServiceLayer("http://tnc.usm.edu/ArcGIS/rest/services/IMDS/ProjectTracking/MapServer");
		this.maplayer.setOpacity(0.6)	
		this.maplayer.setVisibleLayers([1])
		layerDefinitions = [];
		layerDefinitions[1] = "Level = " + pageParameters.level;
		this.maplayer.setLayerDefinitions(layerDefinitions);	
        this.map.addLayer(this.maplayer);
		
		
		var wsrenderer = new esri.renderer.SimpleRenderer(new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_NULL,new dojo.Color([0,0,0]), 0),new dojo.Color([255, 0, 0, 0.3])));
		
		
		this.featureLayer = new FeatureLayer("http://tnc.usm.edu/ArcGIS/rest/services/IMDS/ProjectTracking/MapServer/1",{
          mode: FeatureLayer.MODE_SELECTION,
         outFields: ["*"]
        });
		
		this.featureLayer.setRenderer(wsrenderer);
		
		this.featureLayer.setMaxAllowableOffset(1000);
		
	
        this.map.addLayer(this.featureLayer);
		
		
		thing = this;
		this.clickhandle = dojo.connect(this.map,"onClick", this.genreport, thing);
		
		
		initExtent = new esri.geometry.Extent({"xmin":-90,"ymin":40,"xmax":-80,"ymax":53,"spatialReference":{"wkid":4326}});
	
		this.initExtent = []
		this.initExtent.push(initExtent);
		this.initExtent.push(initExtent);
		this.initExtent.push(initExtent);
		this.initExtent.push(new esri.geometry.Extent({"xmin":-90,"ymin":40,"xmax":-85,"ymax":48,"spatialReference":{"wkid":4326}}));

		
		
        //create a feature layer based on the feature collection
        this.prlayer = new FeatureLayer("http://tnc.usm.edu/ArcGIS/rest/services/IMDS/ProjectTracking/MapServer/0",{
	        mode: FeatureLayer.MODE_SELECTION,
	        infoTemplate: new esri.InfoTemplate("${title}","<img src='${photo}' width=220/><br>${desc}<br><a href='http://imds.greenlitestaging.com/project-tracking/${nid}' target='_blank' >Click For More Info</a>"),
	        outFields: ["*"]
	       });
		  

		this.map.addLayers([this.prlayer]);
		
		this.prlayer.on("click", lang.hitch(this,function(evt) {
			
			
			for (var i=0; i<this.data.length; i++)
			{
				a = (this.grid.row(i))
				
				
				if (a.data.nid == evt.graphic.attributes.nid) {
				console.log(a.data.nid);
				console.log(evt.graphic.attributes.nid);
				   this.map.infoWindow.hide()
				   this.grid.clearSelection()
				   this.grid.select(a)
				}
			}
			
			
          
        }));
		
		if (pageParameters.units != undefined) {
		 ids = pageParameters.units.split(",");
		  
	      qr = new esri.tasks.Query();
		  
		  wheres = []
		  for (id in ids) {
			  
			  wheres.push("ObjectID = " + ids[id]);
			  
			  
		  }
		  
		  outwhere = wheres.join(" OR ")
		  
          qr.where = outwhere; 
		
         this.featureLayer.selectFeatures(qr,FeatureLayer.SELECTION_NEW, lang.hitch(this, this.restrictGeography));
		}

			
		this.restrictGeography();
			
			  
			  
			  this.relPane = new FloatingPane({
				 title: "Related Content",
				 resizable: true, dockable: true, closable: false,
				 style: "position:absolute;top:100px;left:2000px;width:220px;height:200px;closable:false;z-index:9000;",  //;visibility:hidden
				 id: "pFloatingPane"
			  }, dojo.byId("related"));

			  this.relPane.startup();

				this.legPane = new FloatingPane({
				 title: "Legend",
				 resizable: true, dockable: true, closable: false,
				 style: "position:absolute;top:0px;left:2000px;width:220px;height:220px;closable:false;z-index:9000;",  //;visibility:hidden
				 id: "pFloatingPaneLeg"
			  }, dojo.byId("legendDiv"));

			  this.legPane.startup();
  

		  	  this.legend = new Legend({
				map:this.map,
				layerInfos:[{layer:this.prlayer,title:'Projects'}] 
				},"legend");
			  this.legend.startup();
			
		
			  this.collapse();
			  			  
			  cs = dom.byId("csbut");
		
				on(cs, "click", lang.hitch(this,this.collapse))
				
				
			  	fs = dom.byId("fsbut");
		
				on(fs, "click", lang.hitch(this,this.fullscreen))
				
				
				on(document, "keyup", lang.hitch(this,function(event) {
				console.log(event)
					if (event.keyCode == 27) {
					  this.collapse();
					  
					}
				}));
				
			  on(window, 'resize', lang.hitch(this,function() { 
			  
					if (this.inFullscreen == true) {
					
						this.fullscreen();
					
					} else {
					
						this.collapse();
					
					}
					
					}))
			  
		   },
		  
		  changeinsides: function() {
			
			a = dijit.byId("pstuff");
			
			//alert(a.h);
			
			domStyle.set("gridloc", "height", (a.h - 170) + "px");
			
			this.map.resize(true)	
			this.map.reposition()
		  
		  },
		  
		  fullscreen: function() {
		  
			//lex = this.map.getLevel()
		  
			//alert(cex);
			
			cex = this.map.extent;
		  
			win.scrollIntoView("vt");
		  
			vs = win.getBox();
		  
			domStyle.set("csbut", "display", "");
		  	domStyle.set("fsstuff", "top", "0px");
			domStyle.set("fsstuff", "left", "0px");
			domStyle.set("fsstuff", "width", (vs.w + 15) + "px");
			//domStyle.set("thebc", "width", (vs.w + 15) + "px");
			domStyle.set("fsstuff", "height", (vs.h) + "px");
			//domStyle.set("pstuff", "width", (vs.w + 15) + "px");
			
			
			domStyle.set("container", "height", 0 + "px");
			domStyle.set("ssloc", "height", 0 + "px");
			
			//domStyle.set("map", "height", (vs.h - 490) + "px");
			
			domStyle.set("pFloatingPane", "top", 5 + "px");
			domStyle.set("pFloatingPane", "left", (vs.w - 285) + "px");			
			
			domStyle.set("pFloatingPaneLeg", "top", (vs.h - 490) - 260 + "px");
			domStyle.set("pFloatingPaneLeg", "left", 5 + "px");		
				

	        this.map.resize(true)	
			this.map.reposition()

			this.inFullscreen = true;
			
			//this.map.centerAt(cex.getCenter()).then(setTimeout(lang.hitch(this,this.fullscreen),3000));
		
				  
		  
		  },
		  
		  collapse: function() {
		  
		    cex = this.map.extent;
		  
		  
		  	ss = domGeom.position("ssloc", true);
			
			//domStyle.set("thebc", "height",  "1010px");
			domStyle.set("csbut", "display", "none");
			domStyle.set("fsstuff", "width", "925px");
			domStyle.set("fsstuff", "height", "1010px");
			domStyle.set("fsstuff", "top", ss.y + "px");
			domStyle.set("fsstuff", "left", ss.x + "px");
			//domStyle.set("eMap", "height", "510px");
			
			domStyle.set("container", "height", "");
			domStyle.set("ssloc", "height", 1010 + "px");

			domStyle.set("pFloatingPane", "top", 5 + "px");
			domStyle.set("pFloatingPane", "left", (ss.w - 285) + "px");			
			
			domStyle.set("pFloatingPaneLeg", "top", 245 + "px");
			domStyle.set("pFloatingPaneLeg", "left", 5 + "px");	

			this.map.resize(true)			
			this.map.reposition()
			

			this.inFullscreen = false;
			
			
			this.map.centerAt(cex.getCenter())
			
					  
		  },
		   
		  restrictGeography: function() {
		  
				this.map.infoWindow.hide();
				
				selfeats = this.featureLayer.getSelectedFeatures();		
				
				query = new esri.tasks.Query();
				
				knartvals = {}
			
				  
				 geopart = ""
				 geoq = []
				 
				 if (selfeats.length != 0) { 
				 
				  FeatureExtent = esri.graphicsExtent(selfeats);
					
				  this.map.setExtent(FeatureExtent, true);
				 
				  for (feat in selfeats) {
					  
					  knnow = selfeats[feat].attributes["Knowledge_Network_ID"] + "?" + Math.floor(Math.random()*1000)
					  
					  if (!(knnow in knartvals)) {
						  
						  knartvals[knnow] = selfeats[feat].attributes["InlandAquaticUnit"];
						  
					  }
					 
					  levf = "Level" + this.currentlevel + "_Id"
					  geoq.push(levf + "=" + selfeats[feat].attributes[levf])
				  }
					  
				 geopart = " AND (" + geoq.join(" OR ") + ")"
				
				}

				checkers = dq(".taxaCheck");
		 
		 		outs = {}
		
				rellink =[]
				
				array.forEach(checkers, lang.hitch(this,function(entry, index) {
					citem = registry.byNode(entry);
					cmen = dijit.getEnclosingWidget(entry.parentNode);
					if (citem.checked == true) {
							cc = cmen.get("text");
							ctid = cmen.get("tid");
							a = citem.get("value");
							knart = citem.get("knaid");

							if (knart != undefined) {
								knartvals[knart] = citem.text;
							}
							
							gg = cmen.get("gg");
							
							if (ctid != undefined) {
								
								if (ctid == "") {
	//needs to be fixed!!!							
								rellink.push("term_node_tid_depth" + gg + "%5B%5D=" + citem.value)
								
								} else {
								
								rellink.push("term_node_tid_depth_" + ctid + gg + "%5B%5D=" + citem.value)
								
								}
								
							}
						
						this.relinks = rellink.join("&")						
						
						
						cmenlen = cmen.getChildren().length
						isorgroupraw = cmen.getChildren()[cmenlen-2].checked
						if (isorgroupraw == true) {isorgroup = "AND"} else {isorgroup = "OR"};
						if (outs[cc] == undefined) {
							outs[cc] = {vals:[],jt:" " + isorgroup};
							console.log(outs)
						}
						isorraw = cmen.getChildren()[cmenlen-1].checked
						if (isorraw == true) {isor = "AND"} else {isor = "OR"};
						outs[cc].vals.push(isor + " taxonomy LIKE '%\"tid\": \"" + citem.value + "\"%'")
			
			
					};
				}));
				
				runningstr = ""
	 	
				 for (groupl in outs) {
					 
					 oqs = outs[groupl].vals.join(" ");
					 oqs = oqs.slice(3,oqs.length)
					 stepstr = outs[groupl].jt + " (" + oqs + ")"
					 runningstr = runningstr + stepstr
					 
				 }
		
				runningstr = runningstr.slice(4,runningstr.length);
				
				outq = "(" + runningstr + ")" + geopart;
				
				 testq = outq.slice(0,2);
				 if (testq == "()") {
					 
					outq = "ObjectID < 0" 
				 }
				  
				  query.where = outq;
					
				
				  this.prlayer.selectFeatures(query,esri.layers.FeatureLayer.SELECTION_NEW, lang.hitch(this, this.newprselect)) //, function(f,sm) {thing.selcomplete(f,sm,thing)},function(a,b) {alert(a)});

				  knout = ""
				  
				  for (kn in knartvals) {
					  
					  knout = knout + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href='http://imds.greenlitestaging.com/knowledge-network/" + kn + "' target='_blank'>" + knartvals[kn] + "</a><br>";
				  }
				  
				  //alert(knout)
				  
				  relcontent = ("&bull;&nbsp;Related Knowledge Network Items:<br>&nbsp;&nbsp;&nbsp;<a href='http://imds.greenlitestaging.com/conceptual-model-search/search?keywords=&" + this.relinks +"' target='_blank'>Models & Collaboratives</a><br>&nbsp;&nbsp;&nbsp;Related Articles:<br>" + knout + "&bull;&nbsp;<a href='http://imds.greenlitestaging.com/data-catalog/search?keywords=&" + this.relinks +"' target='_blank'>Related Data Catalog Items</a><br>&bull;&nbsp;<a href='http://imds.greenlitestaging.com/dynamic-maps-search/search?keywords=&" + this.relinks + "' target='_blank'>Related Dynamic Maps</a><br>&bull;&nbsp;<a href='http://imds.greenlitestaging.com/decision-tools-search/search?keywords=&" + this.relinks + "' target='_blank'>Related Decision Tools</a> <br> <br>") 
				  
				  dom.byId("relatedcontent").innerHTML = relcontent;
				 
		  
		  },
		  
		  newprselect: function(f,sm) {
		  
		  
		  if (this.firstload == true) {
		  
			this.firstload = false;
		  
		  
		  }
		  
			this.legend.refresh();
			
		   this.data = []
		   
		   totalm = 0
		   
		   array.forEach(f, lang.hitch(this, function(feat,i) {

			atts = feat.attributes;
			shortd = dojo.eval(atts.field_pt_short_description);
			desc = shortd[0].value;
			this.data.push({title:atts.title,"Project_Status":atts.Project_Status,field_pt_short_description:desc,nid:atts.nid});
					
					 
			//console.log(feat.attributes["field_branding_photo"])
			descar2 = dojo.eval(feat.attributes["field_branding_photo"]);
			
			mtt = dojo.eval(feat.attributes["field_funding_amount"]); 
			money = parseFloat(mtt[0].amount);
					 
					 
					 
			 if (isNaN(money)) {
				 money = 0.0;
			 }
			 
			 totalm = totalm + money;
		
			 try {
			 fbp = descar2[0].filepath;
			 feat.attributes["photo"] = "http://imds.greenlitestaging.com/" + fbp;
			 console.log(fbp);
			 } catch(e) {
				 console.log(desc);
			 }
			
			 //console.log(fbp);
			 feat.attributes["desc"] = desc;			
		   
		   }));
		  
		    //var store = new Memory({ data: data });
		
		if (this.grid != undefined) {
			this.grid.destroy( true ); 
		}
         
		node = domConstruct.toDom('<div id="gridloc" style="width:98%;height:330px"></div>')
		domConstruct.place(node, "pstuff", "last");
		 
        // Create an instance of OnDemandGrid referencing the store
			this.grid = new (declare([Grid, ColumnResizer, Selection, ColumnHider]))({
				selectionMode: "single",
				//store: store,
				columns: {
					title: {
						label: "Project Title",
						resizable: true
					},
					field_pt_short_description: {
						label: "Short Description",
						resizable: true
					},
					Project_Status:  {
						label: "Status",
						resizable: true
					},
					nid:  {
						label: "ID",
						hidden: true
					}
					
				}
			}, "gridloc");
     

			this.grid.renderArray(this.data);
			
			this.grid.on("dgrid-select", lang.hitch(this,function(event){
				
				// Get the rows that were just selected
				rows = event.rows;
				//console.log(rows[0].data);
				
				nidtest = rows[0].data.nid;
		
				recs = this.prlayer.getSelectedFeatures()
		
				array.forEach(recs, lang.hitch(this, function(r, index) {
					if (nidtest == r.attributes.nid) {
						
						this.map.infoWindow.hide()
						if ((r.geometry.x == 0) && (r.geometry.y == 0)) {
						
						} else {
						console.log(r.attributes.nid);
						//console.log(this.map.infoWindow);
						
						//this.grid.clearSelection()
						this.map.infoWindow.setFeatures([r]);
						this.map.infoWindow.show(r.geometry);
						this.map.centerAt(r.geometry)
						}
					}
				}));
        
			
			}));
		

			this.map.resize(true)	
			this.map.reposition()
			
			if (this.ft == true) {
			this.map.setLevel(5) //.then(setTimeout(lang.hitch(this,(function(){this.map.setLevel(5); this.map.reposition(); this.map.resize(true)}), 500)))
			this.ft = false
			}
			
			//on(this.grid, "click", function(event){
			//	//row = grid.row(event);
			//	console.log(event)
			//});
			
			//this.grid.on(touchUtil.selector(".dgrid-row", touchUtil.tap), function(event){
			//	row = grid.row(event);
			//	alert(row)
			//});
		  
		
			if (f.length > 0) {
					
				//totalf = "$" + Ext.util.Format.number(totalm, "0,000.00");

					totalf = localeCurrency.format(totalm, {currency: "USD"});				
				
					labelnode = dom.byId("statarea");
					labelnode.innerHTML = ("Projects (" + f.length + " selected) - Total Funding " + totalf + " :" )
				
				} else {
		
					labelnode = dom.byId("statarea");
					labelnode.innerHTML = ("No project match the current query - Please change parameters" )	
		
				}
			
		  
		  },
		   
		  changelevel: function(newlevel, label) {
			  
			           atb = dijit.byId("LevelButton");
            		   atb.set("label", label); 
            		   
            		   layerDefinitions = [];
            		   layerDefinitions[1] = "Level = " + newlevel;
            		   this.maplayer.setLayerDefinitions(layerDefinitions);	
            		   
            		   this.currentlevel = newlevel;
        
            		   this.clearall();
            		   //this.map.setExtent(this.initExtent[newlevel])
            		   
            		   //this.zoomcurrentlevel();
			  
		  },
		  
		  zoomcurrentlevel: function() {
			  
			  this.map.setExtent(this.initExtent[this.currentlevel])
			  
		  },
		   
		   
		 genreport: function(evt) {
	
	      var query = new esri.tasks.Query();
		  
		  toleranceInPixel = 1;
		  point = evt.mapPoint;
		  var pixelWidth = thing.map.extent.getWidth() / thing.map.width;
       	  var toleraceInMapCoords = toleranceInPixel * pixelWidth;
		  query.geometry = new esri.geometry.Extent(point.x - toleraceInMapCoords,
                    point.y - toleraceInMapCoords,
                    point.x + toleraceInMapCoords,
                    point.y + toleraceInMapCoords,
                    thing.map.spatialReference );
                    
           
		  query.where = thing.maplayer.layerDefinitions[1];	
          
          if (evt.shiftKey == true) {
          //if (ctype == "Cumulative") {
          	 node = dom.byId(thing.outputid);
			 dojo.empty(node);
			 thing.featureLayer.selectFeatures(query,esri.layers.FeatureLayer.SELECTION_ADD, lang.hitch(thing, thing.featureSelector));
			} else {
		     thing.featureLayer.selectFeatures(query,esri.layers.FeatureLayer.SELECTION_NEW, lang.hitch(thing, thing.featureSelector));
			}
			
		 	
		 },
		 
		 clearall: function(clears) {
			 
			 allchecks = dq(".taxaCheck");
		 
			array.forEach(allchecks, lang.hitch(this,function(entry, i) {
				mywidget = registry.byNode(entry);
				a = mywidget.set("checked", false);
				//on(mywidget, "change", lang.hitch(this,this.restrictGeography));
			}));

			 allchecks = dq(".taxaStatus");
		 
			array.forEach(allchecks, lang.hitch(this,function(entry, i) {
				mywidget = registry.byNode(entry);
				a = mywidget.set("checked", true);
				//on(mywidget, "change", lang.hitch(this,this.restrictGeography));
			}));
			 
			 
			 //node = dom.byId(this.outputid);
			 //dojo.empty(node);
			 

			 this.featureLayer.clearSelection();
			 
			 this.map.setExtent(this.initExtent[this.currentlevel])
			 
			 this.zoomcurrentlevel();
			 
			 this.restrictGeography();
			 
			 
		 },
		 
		featureSelector: function(features, selectionMethod) {
		
		  this.restrictGeography();

		},
		 
		   _close: function() {
		   
		   		this.destroy();   
			   
		   }

        });
});