//, summarizebyunit

define(["dojo/_base/declare","dijit/_WidgetBase", "dijit/_TemplatedMixin", "dojo/text!./templates/prtrack.html", "dojo/dom-style", "dojo/dom-class", "dojo/_base/fx", "dojo/_base/kernel", "dojo/_base/lang", "dojo/on", "dojo/mouse", "dojo/query", "dojo/store/Memory", "dijit/form/ComboBox", "dijit/form/DropDownButton", "dijit/DropDownMenu", "dijit/MenuItem", "dojo/dom", "dojo/parser", "dojo/query", "dijit/registry", "dijit/layout/TabContainer", "dijit/layout/ContentPane", "dojo/dom-construct", "dijit/form/Button", "dijit/CheckedMenuItem", "dojo/_base/array", "dgrid/Grid", "dojo/store/Memory", "dgrid/OnDemandGrid", "dgrid/extensions/ColumnResizer"],
    function(declare, WidgetBase, TemplatedMixin, template, domStyle, domClass, baseFx, dojo, lang, on, mouse, query, Memory, ComboBox, DropDownButton, DropDownMenu, MenuItem, dom, parser, dq, registry, TabContainer, ContentPane, domConstruct, Button, CheckedMenuItem, array, Grid, Memory, OnDemandGrid, ColumnResizer){
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
            
            toolbar: null,
        
            currentlevel : 2,
            
            expanded: true,
            
            outputid: "",
            
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
				 
				 
				   this.clearButton = new Button({
            label: "Clear Selection",
            onClick: lang.hitch(this,this.clearall)
        }, "Cselect");
        
        var menu2 = new DropDownMenu({ style: "display: none;"});
        var menuItem12 = new MenuItem({
            label: "Entire Great Lakes Basin",
            onClick: lang.hitch(this,this.changelevel, 1, "Entire Great Lakes Basin")
        });
        menu2.addChild(menuItem12);

        var menuItem22 = new MenuItem({
            label: "Individual Lake Drainage Basins",
            onClick: lang.hitch(this,this.changelevel, 2, "Individual Lake Drainage Basins")
            
        });
        menu2.addChild(menuItem22);
        
        var menuItem23 = new MenuItem({
            label: "Subwatersheds",
            onClick: lang.hitch(this,this.changelevel, 3, "Subwatersheds")
        });
        menu2.addChild(menuItem23);

        var button2 = new DropDownButton({
            label: "Individual Lake Drainage Basins",
            name: "programmatic2",
            dropDown: menu2,
            id: "LevelButton"
        });
        dom.byId("LSelect").appendChild(button2.domNode);
				 
		 allchecks = dq(".taxaCheck");
		 
		 array.forEach(allchecks, lang.hitch(this,function(entry, i) {
				mywidget = registry.byNode(entry);
				a = mywidget.get("value");
				on(mywidget, "change", lang.hitch(this,this.restrictGeography));
			}));

		 allchecks = dq(".logicCheck");
		 
		 array.forEach(allchecks, lang.hitch(this,function(entry, i) {
				mywidget = registry.byNode(entry);
				on(mywidget, "change", lang.hitch(this,this.restrictGeography));
			}));			
		 
	
		

			 this.map.reposition();
			 
			 this.inherited(arguments);
			
		this.maplayer = new esri.layers.ArcGISDynamicMapServiceLayer("http://tnc.usm.edu/ArcGIS/rest/services/IMDS/ProjectTracking/MapServer");
		this.maplayer.setOpacity(0.6)	
		this.maplayer.setVisibleLayers([1])
		layerDefinitions = [];
		layerDefinitions[1] = "Level = 2";
		this.maplayer.setLayerDefinitions(layerDefinitions);	
        this.map.addLayer(this.maplayer);
		
		
		var wsrenderer = new esri.renderer.SimpleRenderer(new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_NULL,new dojo.Color([0,0,0]), 0),new dojo.Color([255, 0, 0, 0.3])));
		
		
		this.featureLayer = new esri.layers.FeatureLayer("http://tnc.usm.edu/ArcGIS/rest/services/IMDS/ProjectTracking/MapServer/1",{
          mode: esri.layers.FeatureLayer.MODE_SELECTION,
         outFields: ["*"]
        });
		
		this.featureLayer.setRenderer(wsrenderer);
		
		this.featureLayer.setMaxAllowableOffset(1000);
		
	
        this.map.addLayer(this.featureLayer);
        
        
        thing = this
		query = new esri.tasks.Query();
		query.where = "Level = 2";
		//this.featureLayer.selectFeatures(query,esri.layers.FeatureLayer.SELECTION_NEW,function(f,sm) {thing.featureSelector(f,sm,thing)});
        
       
		
		thing = this;
		this.clickhandle = dojo.connect(this.map,"onClick", this.genreport, thing);
		
		
		initExtent = new esri.geometry.Extent({"xmin":-90,"ymin":40,"xmax":-80,"ymax":53,"spatialReference":{"wkid":4326}});
	
		this.initExtent = []
		this.initExtent.push(initExtent);
		this.initExtent.push(initExtent);
		this.initExtent.push(initExtent);
		this.initExtent.push(new esri.geometry.Extent({"xmin":-90,"ymin":40,"xmax":-85,"ymax":48,"spatialReference":{"wkid":4326}}));
		
			 //on(closebuts[0], "click", lang.hitch(this,this._close));
			 
			 //this.tool = new this.tooltype({"name":"George",map:this.map});
			 //this.tool.placeAt(this.domNode);
		     //this.tool.startup();
		
		popup = new esri.dijit.Popup({
          fillSymbol: new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255,0,0]), 2), new dojo.Color([255,100,0,0.25]))
        }, dojo.create("div"));
       
       dojo.addClass(this.map.infoWindow.domNode, "myTheme");
		
		popupTemplate = new esri.dijit.PopupTemplate({
          title: "<br>{title}",
          description: "<img src='{photo}' width=220/><br>{desc}<br><br><a href='http://imds.greenlitestaging.com/project-tracking/{nid}' target='_blank' >Click For More Info</a>",
          showAttachments:false
        });
        
        this.map.infoWindow = popup;
		
        //create a feature layer based on the feature collection
        this.prlayer = new esri.layers.FeatureLayer("http://tnc.usm.edu/ArcGIS/rest/services/IMDS/ProjectTracking/MapServer/0",{
	        mode: esri.layers.FeatureLayer.MODE_SELECTION,
	        infoTemplate: popupTemplate,//new esri.InfoTemplate("<br><a href='http://tnc.greenlitestaging.com/project-tracking/${nid}' target='_blank' >${title}</a>","${body}"),
	        outFields: ["*"]
	       });

		this.map.addLayers([this.prlayer]);
		
		query = new esri.tasks.Query();
		query.where = "OBJECTID > -1";
		this.prlayer.selectFeatures(query,esri.layers.FeatureLayer.SELECTION_NEW, lang.hitch(this, this.newprselect))
		
		
			 
		   },
		   
		  restrictGeography: function() {
		  
				
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
							
							if (ctid != undefined) {
								
								if (ctid == "") {
								
								rellink.push("term_node_tid_depth%5B%5D=" + citem.value)
								
								} else {
								
								rellink.push("term_node_tid_depth_" + ctid + "%5B%5D=" + citem.value)
								
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
					  
					  knout = knout + "&nbsp;&nbsp;&nbsp;&nbsp;<a href='http://imds.greenlitestaging.com/knowledge-network/" + kn + "' target='_blank'>" + knartvals[kn] + "</a><br>";
				  }
				  
				  //alert(knout)
				  
				  //this.relatedContent.items.get(0).update("Related Knowledge Network Items:<br>&nbsp;&nbsp;<a href='http://imds.greenlitestaging.com/knowledge-network-search/search?keywords=&" + this.relinks +"' target='_blank'>Models & Collaboratives</a><br>&nbsp;&nbsp;Related Articles:<br>" + knout + "<a href='http://imds.greenlitestaging.com/data-catalog-search/search?keywords=&" + this.relinks +"' target='_blank'>Related Data Catalog Items</a><br><a href='http://imds.greenlitestaging.com/dynamic-maps-search/search?keywords=&" + this.relinks + "' target='_blank'>Related Dynamic Maps</a><br><a href='http://imds.greenlitestaging.com/decision-tools-search/search?keywords=&" + this.relinks + "' target='_blank'>Related Decision Tools</a>") 
				 
				 //this.relatedContent.alignTo(this.map.id,"tr-tr", [-2, 27]);
				  
				 //this.relatedContent.show();
		  
		  },
		  
		  newprselect: function(f,sm) {
		  
	
		   data = []
		   
		   totalm = 0
		   
		   array.forEach(f, lang.hitch(this, function(feat,i) {

			atts = feat.attributes;
			shortd = dojo.eval(atts.field_pt_short_description);
			desc = shortd[0].value;
			data.push({title:"<b>" + atts.title + "</b>","Project_Status":atts.Project_Status,field_pt_short_description:desc});
					
					 
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
		  
		    var store = new Memory({ data: data });
         
        // Create an instance of OnDemandGrid referencing the store
			var grid = new (declare([OnDemandGrid, ColumnResizer]))({
				store: store,
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
					}
					
				}
			}, "grid");
     

			grid.startup();
		  
		
			if (f.length > 0) {
					
				totalf = "$" + Ext.util.Format.number(totalm, "0,000.00");	

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
			 
			 node = dom.byId(this.outputid);
			 dojo.empty(node);
			 

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