//, summarizebyunit

define(["dojo/_base/declare","dijit/_WidgetBase", "dijit/_TemplatedMixin", "dojo/text!./templates/bcr.html", "dojo/dom-style", "dojo/dom-class", "dojo/_base/fx", "dojo/_base/lang", "dojo/on", "dojo/mouse", "dojo/query", "dojo/store/Memory", "dijit/form/ComboBox", "dijit/form/DropDownButton", "dijit/DropDownMenu", "dijit/MenuItem", "dojo/dom", "dojo/parser", "dijit/layout/TabContainer", "dijit/layout/ContentPane", "dojo/dom-construct", "dijit/form/Button", "dojo/dom-attr", "dojo/_base/array", "dijit/registry"],
    function(declare, WidgetBase, TemplatedMixin, template, domStyle, domClass, baseFx, lang, on, mouse, query, Memory, ComboBox, DropDownButton, DropDownMenu, MenuItem, dom, parser, TabContainer, ContentPane, domConstruct, Button, domAttr, array, registry){
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
		        
		   this.clearButton = new Button({
            label: "Clear Selection",
            onClick: lang.hitch(this,this.clearall)
        }, "Cselect");
		   
		var Tmenu = new DropDownMenu({ style: "display: none;"});
        var TmenuItem1 = new MenuItem({
            label: "Black Tern",
            onClick: function(){ 
            		   atb = dijit.byId("TTypeButton");
            		   atb.set("label", "Black Tern"); 
            		   thing.updatecharts();
            		 }
        });
        Tmenu.addChild(TmenuItem1);

        var TmenuItem2 = new MenuItem({
            label: "King Rail",
            onClick: function(){ 
            		   atb = dijit.byId("TTypeButton");
            		   atb.set("label", "King Rail"); 
            		   thing.updatecharts();
            		 }
        });
        Tmenu.addChild(TmenuItem2);

        var Tbutton = new DropDownButton({
            label: "Black Tern",
            name: "programmatic2",
            dropDown: Tmenu,
            id: "TTypeButton"
        });
        dom.byId("TSelect").appendChild(Tbutton.domNode);
        
        
        var Hmenu = new DropDownMenu({ style: "display: none;"});
        var HmenuItem1 = new MenuItem({
            label: "Deep Water Marsh",
            onClick: function(){ 
            		   atb = dijit.byId("HTypeButton");
            		   atb.set("label", "Deep Water Marsh"); 
            		   thing.updatecharts();
            		 }
        });
        Hmenu.addChild(HmenuItem1);

        var HmenuItem2 = new MenuItem({
            label: "Shallow Marsh",
            onClick: function(){ 
            		   atb = dijit.byId("HTypeButton");
            		   atb.set("label", "Shallow Marsh"); 
            		   thing.updatecharts();
            		 }
        });
        Hmenu.addChild(HmenuItem2);

        var Hbutton = new DropDownButton({
            label: "Deep Water Marsh",
            name: "programmatic2",
            dropDown: Hmenu,
            id: "HTypeButton"
        });
        dom.byId("HSelect").appendChild(Hbutton.domNode);
        
        
        
        		   
		var menu = new DropDownMenu({ style: "display: none;"});
        var menuItem1 = new MenuItem({
            label: "Cumulative",
            onClick: function(){ 
            		   atb = dijit.byId("ATypeButton");
            		   atb.set("label", "Cumulative"); 
            		   thing.clearall();
            		 }
        });
        menu.addChild(menuItem1);

        var menuItem2 = new MenuItem({
            label: "Compare",
            onClick: function(){ 
            		   atb = dijit.byId("ATypeButton");
            		   atb.set("label", "Compare");
            		   thing.clearall(); 
            		 }
        });
        menu.addChild(menuItem2);

        var button = new DropDownButton({
            label: "Cumulative",
            name: "programmatic2",
            dropDown: menu,
            id: "ATypeButton"
        });
        dom.byId("ASelect").appendChild(button.domNode);
        
        
        radioHab = dojo.byId("radioHabitat");
        radioSpec = dojo.byId("radioSpecies");
        
        on(radioHab, "click", function() {
            		   
            		   atb = dojo.byId("TSelect");
            		   domAttr.set(atb, "style", "display:none");
            		    
            		   atb = dojo.byId("HSelect");
            		   domAttr.set(atb, "style", "display:"); 
            		   
            		   thing.updatecharts();
	        
        })
        
        on(radioSpec, "click", function() {

            		   atb = dojo.byId("TSelect");
            		   domAttr.set(atb, "style", "display:");
            		    
            		   atb = dojo.byId("HSelect");
            		   domAttr.set(atb, "style", "display:none");  
            		   
            		   thing.updatecharts();
        })
        
        //alert(radioHab.checked)
        
        
        var menu2 = new DropDownMenu({ style: "display: none;"});
        var menuItem12 = new MenuItem({
            label: "Entire Upper MS Great Lake Joint Venture",
            onClick: lang.hitch(this,this.changelevel, 1, "Entire Upper MS Great Lake Joint Venture")
        });
        menu2.addChild(menuItem12);

        var menuItem22 = new MenuItem({
            label: "Bird Conservation Regions",
            onClick: lang.hitch(this,this.changelevel, 2, "Bird Conservation Regions")
            
        });
        menu2.addChild(menuItem22);
        
        var menuItem23 = new MenuItem({
            label: "Bird Conservation Subregions",
            onClick: lang.hitch(this,this.changelevel, 3, "Bird Conservation Subregions")
        });
        menu2.addChild(menuItem23);

        var button2 = new DropDownButton({
            label: "Bird Conservation Regions",
            name: "programmatic2",
            dropDown: menu2,
            id: "LevelButton"
        });
        dom.byId("LSelect").appendChild(button2.domNode);
		          
		     //query("#" + this.domNode.id + " a").onclick(function(e){
	         //  e.preventDefault(); 
	          // });
	             
			 this.map.reposition();
			 
			 this.inherited(arguments);
		

		this.maplayer = new esri.layers.ArcGISDynamicMapServiceLayer("http://tnc.usm.edu/ArcGIS/rest/services/IMDS/ProjectTracking/MapServer");
		this.maplayer.setOpacity(0.6)	
		this.maplayer.setVisibleLayers([2])
		layerDefinitions = [];
		layerDefinitions[2] = "Level = 2";
		this.maplayer.setLayerDefinitions(layerDefinitions);	
        this.map.addLayer(this.maplayer);
		
		var wsrenderer = new esri.renderer.SimpleRenderer(new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_NULL,new dojo.Color([0,0,0]), 0),new dojo.Color([255, 0, 0, 0.3])));
		
		
		this.featureLayer = new esri.layers.FeatureLayer("http://tnc.usm.edu/ArcGIS/rest/services/IMDS/ProjectTracking/MapServer/2",{
          mode: esri.layers.FeatureLayer.MODE_SELECTION,
         outFields: ["*"]
        });
		
		this.featureLayer.setRenderer(wsrenderer);
		
		this.featureLayer.setMaxAllowableOffset(1000);
		
	
        this.map.addLayer(this.featureLayer);
        
        
        thing = this
		squery = new esri.tasks.Query();
		squery.where = "Level = 2";
		//this.featureLayer.selectFeatures(query,esri.layers.FeatureLayer.SELECTION_NEW,function(f,sm) {thing.featureSelector(f,sm,thing)});
        
       
		
		thing = this;
		this.clickhandle = dojo.connect(this.map,"onClick", this.genreport, thing);
		
		initExtent = new esri.geometry.Extent({"xmin":-90,"ymin":40,"xmax":-80,"ymax":53,"spatialReference":{"wkid":4326}});
	
		this.initExtent = []
		this.initExtent.push(initExtent);
		this.initExtent.push(initExtent);
		this.initExtent.push(initExtent);
		this.initExtent.push(initExtent);
	
			 //on(closebuts[0], "click", lang.hitch(this,this._close));
			 
			 //this.tool = new this.tooltype({"name":"George",map:this.map});
			 //this.tool.placeAt(this.domNode);
		     //this.tool.startup();
		     
			 
		   },
		   
		  changelevel: function(newlevel, label) {
			  
			  		   
			           atb = dijit.byId("LevelButton");
            		   atb.set("label", label); 
            		   
            		   layerDefinitions = [];
            		   layerDefinitions[2] = "Level = " + newlevel;
            		   this.maplayer.setLayerDefinitions(layerDefinitions);	
            		   
            		   this.currentlevel = newlevel;
            		   
            		   this.clearall();
            		   //this.map.setExtent(this.initExtent[newlevel]);
			  
		  },
		   
		   
		 genreport: function(evt) {
		    		//thing.up().setTitle("Assess and Adapt - No Basin Selected");
		
		
	//	if (thing.cbox.value == "cumulative") {
		
	//		thing.removeAll();
		
	//	} 
	
		  atb = dijit.byId("ATypeButton");
		  ctype = atb.label;
	
		
	      var squery = new esri.tasks.Query();
		  
		  toleranceInPixel = 1;
		  point = evt.mapPoint;
		  var pixelWidth = thing.map.extent.getWidth() / thing.map.width;
       	  var toleraceInMapCoords = toleranceInPixel * pixelWidth;
		  squery.geometry = new esri.geometry.Extent(point.x - toleraceInMapCoords,
                    point.y - toleraceInMapCoords,
                    point.x + toleraceInMapCoords,
                    point.y + toleraceInMapCoords,
                    thing.map.spatialReference );
                    
           
		  squery.where = thing.maplayer.layerDefinitions[2];	
          
          //if (evt.shiftKey == true) {
          if (ctype == "Cumulative") {
          	 node = dom.byId(thing.outputid);
			 dojo.empty(node);
          thing.featureLayer.selectFeatures(squery,esri.layers.FeatureLayer.SELECTION_ADD,function(f,sm) {thing.featureSelector(f,sm,thing)});
			} else {
		  thing.featureLayer.selectFeatures(squery,esri.layers.FeatureLayer.SELECTION_NEW,function(f,sm) {thing.featureSelector(f,sm,thing)});
			}
			
		 	
		 },
		 
		 clearall: function(clears) {
			 
			 node = dom.byId(this.outputid);
			 dojo.empty(node);
			 

			 this.featureLayer.clearSelection();
			 
			 this.zoomcurrentlevel();
			 
			 
		 },
		 
		 zoomcurrentlevel: function() {

			  this.map.setExtent(this.initExtent[this.currentlevel])
			  
		  },
		  
		 updatecharts: function() {
		 
		 		 radioHab = dojo.byId("radioHabitat");
		 		 radioSpec = dojo.byId("radioSpecies");
		 		 
		 		 ttb = dijit.byId("TTypeButton");
		 		 htb = dijit.byId("HTypeButton");
		 		 
		 		allcharts = query(".chartloca");


		 		array.forEach(allcharts, function(entry, i){
			 		//console.debug(entry, "at index", i);
			 		allWidgets = registry.findWidgets(entry);
			 		tc = allWidgets[0];
			 		tc2 = allWidgets[1];
			 		alltabs = tc.getChildren();
			 		alltabs2 = tc2.getChildren();
			 	
			 		if (radioHab.checked == true) {
			 		
			 				if (htb.label == "Deep Water Marsh") {
				 				
				 				//alltabs[0].set("style", "display:")
				 				//alltabs[1].set("style", "display:none")
				 				//alltabs[2].set("style", "display:")
				 				//alltabs[3].set("style", "display:none")
				 			
				 				tc.selectChild(alltabs[1]);
				 				
				 				tc.set("style", "display:block")
				 				tc2.set("style", "display:none")
				 				
			 				} else {
				 				
				 				//alltabs[0].set("style", "display:none")
				 				//alltabs[1].set("style", "display:")
				 				//alltabs[2].set("style", "display:none")
				 				//alltabs[3].set("style", "display:")	
				 				
				 				tc2.selectChild(alltabs2[1]);	

				 				tc.set("style", "display:none")
				 				tc2.set("style", "display:block")
				 						 				
			 				}
				
				 		
			 		} else {
				 		
				 		
			 				if (ttb.label == "Black Tern") {
				 				
				 				//alltabs[0].set("style", "display:")
				 				//alltabs[1].set("style", "display:none")
				 				//alltabs[2].set("style", "display:")
				 				//alltabs[3].set("style", "display:none")
				 				
				 				//tc.removeChild(alltabs[3]) //.domNode.style.visibility = 'hidden';
				 				
				 				tc.selectChild(alltabs[0]);

				 				tc.set("style", "display:block")
				 				tc2.set("style", "display:none")
				 				
			 				} else {
				 				
				 				//alltabs[0].set("style", "display:none")
				 				//alltabs[1].set("style", "display:")
				 				//alltabs[2].set("style", "display:none")
				 				//alltabs[3].set("style", "display:")	
				 				
				 				tc2.selectChild(alltabs2[0]);
				 				
				 				tc.set("style", "display:none")
				 				tc2.set("style", "display:block")
				 							 				
			 				}
			 				
				 		
			 		}
			 		
			 		
			 		//allWidgets[0].set("style", "display:none")
			 	});
			 
			 
		 },
		 
		featureSelector: function(features, selectionMethod) {
		
		
		//this.removeAll();
		
		feats = this.featureLayer.getSelectedFeatures()
		
		if (feats.length == 1) {
		
		newlab = feats[0].attributes["Bird_Conservation_Region"];
		
		} else if (feats.length == 2) {
		
		newlab = feats[0].attributes["Bird_Conservation_Region"] + " and " + feats[1].attributes["Bird_Conservation_Region"]
		
		} else {
			
		newlab = feats[0].attributes["Bird_Conservation_Region"] + " and " + (feats.length - 1) + " other selected basins."	
			
		}
		
	refNode = dojo.byId(this.outputid);
		
		tablerec = domConstruct.create("table");
		domConstruct.place(tablerec, refNode, "first");
		
		//domAttr.set(tablerec, "width", "400");
		
		tablerow1 = domConstruct.create("tr");
		domConstruct.place(tablerow1, tablerec, "last");
		
		td1 = domConstruct.create("td");
		domClass.add(td1, "chartloca");
		domConstruct.place(td1, tablerow1, "last");
		
		td2 = domConstruct.create("td");
		domConstruct.place(td2, tablerow1, "last");
		
		tit = domConstruct.create("h3");
		tit.innerHTML = "<b>" + newlab + "</b>"
		domConstruct.place(tit, refNode, "first");
		
		brn = domConstruct.create("br");
		domConstruct.place(brn, refNode, "first");
		
		//domAttr.set(td1, "width", "5");
		
		//this.up().setTitle(newlab);
		
		FeatureExtent = esri.graphicsExtent(feats);
		
		this.map.setExtent(FeatureExtent, true);
		
		//alert(features[0].attributes.SPGoal)
		
		featlist = []
		
		for (f in feats) {
		
			featlist.push(feats[f].attributes["OBJECTID"]);
		
		}
		
	lev = feats[0].attributes["Level"];
	
	checklinks = [8,36]
	
	checkvals = checklinks.join(",")
	
	relatedlinkstext = ("Related Content</b> - (Click a link below)<ul class='a'><li><a href='http://tnc.usm.edu/pt/?taxa=" + checkvals + "&level=" + lev + "&units=" + featlist.join(",") + "&geo=bcr' target='_blank'>See projects addressing coastal habitat for bird issues in this geography</a></li><li><a href='http://imds.greenlitestaging.com/knowledge-network/662' target='_blank'>Read more about Black Tern profile</a></li><li><a href='http://imds.greenlitestaging.com/data-catalog-search/search?keywords=&term_node_tid_depth%5B%5D=8&term_node_tid_depth%5B%5D=9&term_node_tid_depth_1%5B%5D=36' target='_blank'>Get data related to coastal habitat for birds</a></li><li><a href='http://imds.greenlitestaging.com/dynamic-maps-search/search?keywords=&term_node_tid_depth%5B%5D=8&term_node_tid_depth%5B%5D=9&term_node_tid_depth_1%5B%5D=36' target='_blank'>View maps related to coastal habitat for bird issue</a></li><li><a href='http://imds.greenlitestaging.com/decision-tools-search/search?keywords=&term_node_tid_depth%5B%5D=8&term_node_tid_depth%5B%5D=9&term_node_tid_depth_1%5B%5D=36' target='_blank'>Get tools related to coastal habitat for birds.</a></li></ul>");
	
	td2.innerHTML = relatedlinkstext;
	
	spoptions = {fieldname:"Black_Tern_Population_",start:2007,end:2012,title:"Black Tern Population",ingnoresum:true,yformat:Ext.util.Format.numberRenderer('0,000')}
	mcoptions = {fieldname:"King_Rail_Population_",start:2007,end:2012,title:"King Rail Population",ingnoresum:true,yformat:Ext.util.Format.numberRenderer('0,000')}
	droptions = {fieldname:"Deep_Water_Marsh_",start:2007,end:2012,title:"Deep Water Marsh",ingnoresum:false,yformat:Ext.util.Format.numberRenderer('0,000')}
	foptions = {fieldname:"Shallow_Marsh_",start:2007,end:2012,title:"Shallow Marsh",ingnoresum:false,yformat:Ext.util.Format.numberRenderer('0,000')}
	

	var n = domConstruct.create("div");
	domConstruct.place(n, td1, "last");

	var n2 = domConstruct.create("div");
	domConstruct.place(n2, td1, "last");
	
		var tc = new TabContainer({
            style: "height: 420px; width: 600px;"
        }, n);
        
        var tc2 = new TabContainer({
            style: "height: 420px; width: 600px;"
        }, n2);

        var cp1 = new ContentPane({
             title: spoptions.title,
             style: "height: 420px; width: 600px;"
        });
        tc.addChild(cp1);
        
        cp1.set("content","<div id='" + cp1.id + spoptions.fieldname + "'></div>")
        
        spoptions['refid'] = cp1.id + spoptions.fieldname;

        var cp2 = new ContentPane({
             title: mcoptions.title,
             content:"<div id='" + mcoptions.fieldname + "loc'></div>"
        });
        tc2.addChild(cp2);

        cp2.set("content","<div id='" + cp2.id + mcoptions.fieldname + "'></div>")
        
        mcoptions['refid'] = cp2.id + mcoptions.fieldname;
                
        var cp3 = new ContentPane({
             title: droptions.title,
             content:"<div id='" + droptions.fieldname + "loc'></div>"
        });
        tc.addChild(cp3);
        
        cp3.set("content","<div id='" + cp3.id + droptions.fieldname + "'></div>")
        
        droptions['refid'] = cp3.id + droptions.fieldname;

        var cp4 = new ContentPane({
             title: foptions.title,
             content:"<div id='" + foptions.fieldname + "loc'></div>"
        });
        tc2.addChild(cp4);
        
        cp4.set("content","<div id='" + cp4.id + foptions.fieldname + "'></div>")
        
        foptions['refid'] = cp4.id + foptions.fieldname;
        
        
        tc.startup();
        
        tc2.startup();	
         
       
	spchart = this.createChart(feats, spoptions);
	
	tc2.selectChild(cp2);
	
	mcchart = this.createChart(feats, mcoptions);
	
	tc.selectChild(cp3);
	
	drchart = this.createChart(feats, droptions);
	
	tc2.selectChild(cp4);
	
	fchart = this.createChart(feats, foptions);
	
	tc.selectChild(cp1);
	
	tc2.selectChild(cp2);
	
	this.updatecharts();

	
	    
	},
		


  createChart: function(features, options) {
  
 root = options.fieldname;
  starty = options.start;
  endy = options.end;
  intitle = options.title;
  ignorersum = options.ingnoresum;
  yformat = options.yformat;


sers = [{
            type: 'line',
            highlight: {
                size: 20,
                radius: 7
            },
            axis: 'left',
            xField: 'name',
            yField: 'Goal',
            title: 'Goal',
            markerConfig: {
                type: 'cross',
                size: 4,
                radius: 4,
                'stroke-width': 0
            },
			style: {
    			stroke: '#FF0000',
    			'stroke-width': 3,
    			opacity: 0.9
				}
        },
        {
            type: 'line',
            style: {
    			stroke: '#00ff00',
    			'stroke-width': 2,
    			opacity: 0.9
				},
            axis: 'left',
            fill: false,
            xField: 'name',
			title: intitle,
            yField: 'obs',
            markerConfig: {
                type: 'circle',
				fill: '#000099',
                size: 4,
                radius: 4,
                'stroke-width': 0
            }
        }]

fds = ['Goal', 'obs']


d = []
x = 0


if (ignorersum) {

for (var i = starty; i <= endy; i++) {

	cval = 0 
	for (f in features) {
	cval = cval + features[f].attributes[root + i]
	}
 
	//cval = features[0].attributes[root + i]
	
	x = x + cval;
	
	gval = 0
	for (f in features) {
	gval = gval + features[f].attributes[root + "Goal"]
	}
	
	d.push({ 'name': i, 'Goal': gval,  'obs': cval,  'rsum': x})

var store2 = Ext.create('Ext.data.JsonStore', {
    fields: ['name', 'Goal', 'obs', 'rsum'],
    data: d
});

}
 
} else {



for (var i = starty; i <= endy; i++) {

	cval = 0
	for (f in features) {	
	cval = cval + features[f].attributes[root + i]
	}
	x = x + cval;
	
	gval = 0
	for (f in features) {
	gval = gval + features[f].attributes[root + "Overall_Goal"]
	}
	
	ogval = 0
	for (f in features) {
	ogval = ogval + features[f].attributes[root + "Goal_" + i]
	}
	
	
	d.push({ 'name': i, 'Goal': gval, 'yGoal': ogval, 'obs': cval,  'rsum': x})
	
}

var store2 = Ext.create('Ext.data.JsonStore', {
    fields: ['name', 'Goal', 'yGoal', 'obs', 'rsum'],
    data: d
});

 fds.push('yGoal')
 sers.push({
            type: 'line',
            style: {
    			stroke: '#EE8800',
    			'stroke-width': 2,
    			opacity: 0.9
				},
            axis: 'left',
            fill: false,
            xField: 'name',
			title: 'Yearly Goal',
            yField: 'yGoal',
            markerConfig: {
                type: 'circle',
				fill: '#EEEE00',
                size: 4,
                radius: 4,
                'stroke-width': 0
            }
        })

}



if (!(ignorersum)) {

fds.push('rsum')
sers.push({
            type: 'column',
            axis: 'left',
			title: 'Cumulative',
            highlight: true,
            tips: {
              trackMouse: true,
              width: 80,
              height: 28,
              renderer: function(storeItem, item) {
                this.setTitle(storeItem.get('name') + ': ' + storeItem.get('rsum') );
              }
            },
            //label: {
//              display: 'insideEnd',
//              'text-anchor': 'middle',
//                field: 'rsum',
//                renderer: Ext.util.Format.numberRenderer('0'),
//                orientation: 'vertical',
//                color: '#333'
//            },
			style: {
    			fill: '#119900',
    			opacity: 0.9
				},
            xField: 'name',
            yField: 'rsum'
        })

} 


cht = Ext.create('Ext.chart.Chart', {
	renderTo: options.refid,
    width: 570,
    height: 370,
	title: intitle,
    animate: true,
    store: store2,
	background: {
    //color string
    fill: '#FFF'
	},
	legend: {
        position: 'bottom'
    },
    axes: [
        {
            type: 'Numeric',
            position: 'left',
            fields: fds,
            label: {
                renderer: yformat
            },
            title: intitle,
            grid: true,
            minimum: 0
        },
        {
            type: 'Category',
            position: 'bottom',
            fields: ['name'],
            title: 'Year'
        }
    ],
    series: sers
});

		
return cht;

	
},
		   
		   _close: function() {
		   
		   		this.destroy();   
			   
		   }

        });
});