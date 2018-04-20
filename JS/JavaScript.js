require(["esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/widgets/Legend",
    "esri/widgets/LayerList",
    "esri/widgets/Search",
    "esri/tasks/Locator",
    "esri/layers/MapImageLayer",
    "esri/PopupTemplate",
    "dojo/domReady!"], function (
        Map,
        MapView,
        FeatureLayer,
        Legend,
        LayerList,
        Search,
        Locator,
        MapImageLayer,
        PopupTemplate
        ) {
        //my code starts here

        var mapConfig = {
            basemap: "streets-night-vector"
        };

        var myMap = new Map(mapConfig);

        var mapView = new MapView({
            map: myMap,
            container: "viewDiv",
            center: [-118.2438934, 34.058481],
            zoom: 10
        });
        var fwySym = {
            type: "simple-line", // autocasts as new SimpleLineSymbol()
            color: "#FA3208",
            width: 10,
            style: "solid"
        };
        // Symbol for U.S. Highways
        var hwySym = {
            type: "simple-line", // autocasts as new SimpleLineSymbol()
            color: "#8BFA08",
            width: 7,
            style: "solid"
        };
        // Symbol for other major highways
        var otherSym = {
            type: "simple-line", // autocasts as new SimpleLineSymbol()
            color: "#FAE308",
            width: 3,
            style: "short-dot"
        };
        var hwyRenderer = {
            type: "unique-value", // autocasts as new UniqueValueRenderer()
            defaultSymbol: otherSym,
            defaultLabel: "Other major roads",
            field: "CLASS",
            uniqueValueInfos: [
                { value: "I", symbol: fwySym, label: 'Interstates' },
                { value: "U", symbol: hwySym, label: 'US Highways' }
            ]
        };

        hwyRenderer.legendOptions = {
            title: "Classification"
        };

        //making popup variable
        var hwypopup = {
            title: "Highway Number",
            content: '<p>{NUMBER}</p>',
            
        }
        
        var trailHeadPopup = {
            title: "Los Angeles Trail Head",
            content: '<P>{TRL_NAME}</p>',
        }

        var dynamicRenderer = {
            type: "unique-value",
        };
        //adding the feature layer
        var myFeatureLayer = new FeatureLayer({
            url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/USA_Freeway_System/FeatureServer/2",
            popupTemplate: hwypopup,
            renderer: hwyRenderer
        });

        myMap.add(myFeatureLayer);

        //adding my dynamic service LA Trails 
        var dynamicLayer = new MapImageLayer({
            url: "http://public.gis.lacounty.gov/public/rest/services/PARKS/Trails/MapServer",
            sublayers: [{
                id: 3,
                title: 'Trail Heads',
                popupTemplate: trailHeadPopup,
            },
            {
                id: 1,
                title: 'Trail Amenities',
                popupTemplate: {
                    title: "Trail Amenities",
                    content: '<p>{TRL_NAME}</p>'
                }
            },
            {
            id: 2,
            title: 'Trail Access',
            popupTemplate: {
                title: "Trail Access",
                content: '<p>{TRL_NAME}</p>'
            }
        }],
            renderer: dynamicRenderer,
        });
        myMap.add(dynamicLayer);

        //adding the legend
        var legend = new Legend({
            view: mapView,
            layerInfos: [{ layer: myFeatureLayer, title: 'Highways' }],
            
        });

     
        
        mapView.ui.add(legend, "bottom-left");
        

        var layerList = new LayerList({
            view: mapView
        });

        // Adds widget below other elements in the top left corner of the view
        mapView.ui.add(layerList, {
            position: "top-right"
        });

      

        var searchWidget = new Search({
            view: mapView,
            sources: [
                {
                    locator: new Locator({ url: "//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer" }),
                    singleLineFieldName: "SingleLine",
                    name: "Custom Geocoding Service",
                    localSearchOptions: {
                        minScale: 300000,
                        distance: 50000
                    },
                    placeholder: "Search Geocoder",
                    maxResults: 3,
                    maxSuggestions: 6,
                    suggestionsEnabled: false,
                    minSuggestCharacters: 0
                }, {
                    featureLayer: myFeatureLayer, dynamicLayer,
                    searchFields: ['ROUTE_NUM', 'TRL_NAME', 'PARK_NAME'],
                    displayField: "ROUTE_NUM",
                    exactMatch: false,
                    outFields: ["*"],
                    name: "My Custum Search",
                    placeholder: "example: C18",
                    maxResults: 6,
                    maxSuggestions: 6,
                    suggestionsEnabled: true,
                    minSuggestCharacters: 0,
                }
            ]
        });
        // Adds the search widget below other elements in
        // the top left corner of the view
        mapView.ui.add(searchWidget, {
            position: "top-right",
            index: 2
        });
        //my code ends here
    });