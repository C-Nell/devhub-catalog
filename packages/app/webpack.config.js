const path = require('path');

module.exports = (config) => {
  // Override webpack-dev-server configuration for OpenShift DevSpaces
  if (config.devServer) {
    config.devServer = {
      ...config.devServer,
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: 'all',
      disableHostCheck: true,
      compress: false,
      hot: true,
      static: {
        directory: path.join(__dirname, 'public'),
        publicPath: '/',
      },
      client: {
        webSocketURL: 'auto://0.0.0.0:0/ws',
        overlay: false,
      },
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      },
      // Disable HTTPS to avoid certificate issues
      https: false,
      // Override any host checking
      historyApiFallback: true,
      // Disable host checking completely
      watchOptions: {
        ignored: /node_modules/,
        poll: 1000,
      },
    };
    
    // Additional overrides for OpenShift environment
    delete config.devServer.transportMode;
    delete config.devServer.injectClient;
    delete config.devServer.injectHot;
  }
  
  // Override any problematic plugins
  if (config.plugins) {
    config.plugins = config.plugins.filter(plugin => 
      plugin.constructor.name !== 'ESLintWebpackPlugin'
    );
  }
  
  return config;
};
