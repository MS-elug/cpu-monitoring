/**
 * Override default react-create-scripts build configuration
 *
 * @param {*} config
 * @param {*} env
 * @returns
 */
module.exports = function override(config, env) {
  if (!config.plugins) {
    config.plugins = [];
  }

  // Find TerserPlugin options to add a reserved word for mangle process
  // This is solving the build issue for rickshaw library: https://github.com/shutterstock/rickshaw/issues/52
  config.optimization.minimizer.forEach((minimizer) => {
    try {
      const mangleConfiguration = minimizer.options.terserOptions.mangle;
      if (!mangleConfiguration.reserved) {
        mangleConfiguration.reserved = [];
      }
      if (!mangleConfiguration.reserved.includes('$super')) {
        mangleConfiguration.reserved.push('$super');
      }
    } catch (err) {}
  });

  return config;
};
