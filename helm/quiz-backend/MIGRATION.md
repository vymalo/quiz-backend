# Migration Guide: Upgrading from Common Library v1.5.1 to v4.0.1

This document outlines the steps taken to migrate the Helm chart from using bjw-s-labs common library v1.5.1 to v4.0.1.

## Changes Made

1. **Updated Chart.yaml**
   - Changed the common library dependency version from 1.5.1 to 4.0.1

2. **Updated values.yaml**
   - Restructured values to match the new format required by v4.0.1
   - Added `common` section for global settings
   - Added `serviceAccount.generateToken: false` to align with new behavior
   - Moved controller configuration under `controllers.main`
   - Moved service configuration under `service.main`
   - Moved ingress configuration under `ingress.main`
   - Updated persistence configuration to include `advancedMounts`
   - Moved container configuration under `controllers.main.containers.main`
   - Added `type` field to probes (HTTP, TCP, etc.)

3. **Updated Template Files**
   - Updated the common.yaml file to use the new template name `bjw-s.common.loader.all`
   - Simplified all resource template files to use the common library templates
   - Updated NOTES.txt with correct resource naming
   - Removed custom helper functions from _helpers.tpl as they're now provided by the common library

## Breaking Changes Addressed

1. **Template Structure**
   - The common library now uses a different template structure
   - The main entry point is now `bjw-s.common.loader.all` instead of `common.all`

2. **Values Structure**
   - Controllers are now defined under a `controllers` object with named controllers (e.g., `controllers.main`)
   - Services are now defined under a `service` object with named services (e.g., `service.main`)
   - Ingress is now defined under an `ingress` object with named ingresses (e.g., `ingress.main`)
   - Container configuration is now under `controllers.<name>.containers.<name>`

3. **ServiceAccount Token Generation**
   - ServiceAccounts no longer create a static token by default
   - Added explicit configuration in values.yaml

4. **Kubernetes Version Requirement**
   - The minimum supported Kubernetes version is now 1.28.0

5. **Label Changes**
   - Updated to use the new label naming convention (app.kubernetes.io/controller instead of app.kubernetes.io/component)

6. **Container Probes**
   - Probes now require a `type` field (HTTP, TCP, etc.) to be specified

## Additional Notes

- The common library now handles the creation of all standard Kubernetes resources
- Custom resources or configurations should be added in separate template files
- For any custom functionality, refer to the common library documentation
- Environment variables structure has changed and now requires a more structured format

## Verification Steps

After applying these changes, verify the deployment with:

```bash
helm template helm/quiz-backend
```

This will generate the Kubernetes manifests using the updated common library. The following resources are now generated:
- ServiceAccount
- Service
- Deployment with correct container configuration

## References

- [bjw-s-labs Common Library Documentation](https://bjw-s-labs.github.io/helm-charts/docs/common-library/introduction/)
- [bjw-s-labs Common Library GitHub Repository](https://github.com/bjw-s-labs/helm-charts)