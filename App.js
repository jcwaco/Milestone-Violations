Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

    
    launch: function() {
   
      var self = this;
      Ext.create('Rally.data.wsapi.Store', {
        model: 'TypeDefinition',
        autoLoad:true,
        filters: [{
          property: "TypePath",
          operator: "contains",
          value: "PortfolioItem/"
        }],
    
        listeners: {
            load: function(store, data, success) {
              self.loadPortfolioItems(data[0].data.TypePath);
            }
        }
      });
    },
    loadPortfolioItems: function(typePath) {    
        console.log('loading ' + typePath);
        Ext.create('Rally.data.wsapi.TreeStoreBuilder').build({
            models: [typePath],
            autoLoad: true,  
            enableHierarchy: true,
            context: null,
            filters: [
            {
              property: 'Milestones.ObjectID',
              value: null
            }
           ]
        }).then({
            success: this._onStoreBuilt.bind(this, typePath),
            scope: this
        });
    },
    _onStoreBuilt: function(modelName, store) {
        var modelNames = [modelName],
            context = this.getContext();
        this.add({
            xtype: 'rallygridboard',
            context: context,
            modelNames: modelNames,
            toggleState: 'grid',
            stateful: false,
            plugins: [
                'rallygridboardaddnew',
                {
                    ptype: 'rallygridboardfieldpicker',
                    headerPosition: 'left',
                    modelNames: modelNames,
                    stateful: true,
                    stateId: context.getScopedStateId('milestone-app')
                }
            ],
            gridConfig: {
                store: store,
                columnCfgs: [
                    'Name',
                    'Project',
                    'Parent',
                    'Owner',
                    'Milestones'
                ]
            },
            height: this.getHeight()
        });
    }
  
});
