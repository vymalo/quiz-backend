# Quiz Backend Helm Chart

This Helm chart deploys the Quiz Backend application on a Kubernetes cluster.

## Prerequisites

- Kubernetes 1.19+
- Helm 3.2.0+

## Installing the Chart

To install the chart with the release name `quiz-backend`:

```bash
helm install quiz-backend ./helm/quiz-backend
```

## Uninstalling the Chart

To uninstall/delete the `quiz-backend` deployment:

```bash
helm delete quiz-backend
```

## Configuration

The following table lists the configurable parameters of the Quiz Backend chart and their default values.

| Parameter                                | Description                                      | Default                                                 |
| ---------------------------------------- | ------------------------------------------------ | ------------------------------------------------------- |
| `image.repository`                       | Image repository                                 | `quiz-backend`                                          |
| `image.tag`                              | Image tag                                        | `latest`                                                |
| `image.pullPolicy`                       | Image pull policy                                | `IfNotPresent`                                          |
| `imagePullSecrets`                       | Image pull secrets                               | `[]`                                                    |
| `env.NODE_ENV`                           | Node environment                                 | `production`                                            |
| `serviceAccount.create`                  | Create service account                           | `true`                                                  |
| `serviceAccount.annotations`             | Service account annotations                      | `{}`                                                    |
| `serviceAccount.name`                    | Service account name                             | `""`                                                    |
| `controller.replicas`                    | Number of replicas                               | `1`                                                     |
| `controller.strategy`                    | Deployment strategy                              | `RollingUpdate`                                         |
| `controller.podAnnotations`              | Pod annotations                                  | `{}`                                                    |
| `controller.podSecurityContext`          | Pod security context                             | `{}`                                                    |
| `controller.securityContext`             | Container security context                       | `{}`                                                    |
| `controller.autoscaling.enabled`         | Enable autoscaling                               | `false`                                                 |
| `controller.autoscaling.minReplicas`     | Minimum replicas for autoscaling                 | `1`                                                     |
| `controller.autoscaling.maxReplicas`     | Maximum replicas for autoscaling                 | `10`                                                    |
| `controller.autoscaling.targetCPUUtilizationPercentage` | Target CPU utilization percentage | `80`                                                    |
| `controller.autoscaling.targetMemoryUtilizationPercentage` | Target memory utilization percentage | `80`                                              |
| `controller.resources`                   | Container resources                              | `{limits: {cpu: 500m, memory: 512Mi}, requests: {cpu: 100m, memory: 128Mi}}` |
| `service.type`                           | Service type                                     | `ClusterIP`                                             |
| `service.ports.http.port`                | Service port                                     | `80`                                                    |
| `service.ports.http.targetPort`          | Service target port                              | `http`                                                  |
| `service.ports.http.protocol`            | Service protocol                                 | `TCP`                                                   |
| `ingress.enabled`                        | Enable ingress                                   | `false`                                                 |
| `ingress.className`                      | Ingress class name                               | `""`                                                    |
| `ingress.annotations`                    | Ingress annotations                              | `{}`                                                    |
| `ingress.hosts`                          | Ingress hosts                                    | `[{host: chart-example.local, paths: [{path: /, pathType: Prefix}]}]` |
| `ingress.tls`                            | Ingress TLS configuration                        | `[]`                                                    |
| `persistence.enabled`                    | Enable persistence                               | `false`                                                 |
| `persistence.config.enabled`             | Enable config persistence                        | `false`                                                 |
| `persistence.config.mountPath`           | Config mount path                                | `/app/config`                                           |
| `persistence.config.accessMode`          | Config access mode                               | `ReadWriteOnce`                                         |
| `persistence.config.size`                | Config size                                      | `1Gi`                                                   |
| `persistence.config.storageClass`        | Config storage class                             | `""`                                                    |
| `nodeSelector`                           | Node selector                                    | `{}`                                                    |
| `tolerations`                            | Tolerations                                      | `[]`                                                    |
| `affinity`                               | Affinity                                         | `{}`                                                    |

Specify each parameter using the `--set key=value[,key=value]` argument to `helm install`.

For example:

```bash
helm install quiz-backend ./helm/quiz-backend --set image.tag=v1.0.0
```

Alternatively, a YAML file that specifies the values for the parameters can be provided while installing the chart. For example:

```bash
helm install quiz-backend ./helm/quiz-backend -f values.yaml