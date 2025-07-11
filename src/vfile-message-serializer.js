/**
 * VFileMessage Serializer Fix
 * 
 * This file adds a custom serializer for VFileMessage objects to fix serialization issues during the build process.
 */

// Add this file to the webpack cache serialization process
if (typeof global.WebpackSerializationRegistered === 'undefined') {
  global.WebpackSerializationRegistered = true;
  
  // Register a custom serializer for VFileMessage
  if (global.webpack && global.webpack.util && global.webpack.util.serialization) {
    const { registerSerializers } = global.webpack.util.serialization;
    
    registerSerializers({
      serialize: (vfileMessage) => {
        // Convert VFileMessage to a serializable object
        return {
          message: vfileMessage.message || '',
          reason: vfileMessage.reason || '',
          ruleId: vfileMessage.ruleId || null,
          source: vfileMessage.source || null,
          line: vfileMessage.line || null,
          column: vfileMessage.column || null,
          position: vfileMessage.position || null,
          fatal: vfileMessage.fatal || null,
        };
      },
      deserialize: (serialized) => {
        // Create a simple object with the serialized properties
        return serialized;
      },
      name: 'VFileMessage'
    });
  }
}
