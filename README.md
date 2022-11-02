# sls-dispatcher-kafka-nodejs

## Install

```shell
npm install
```

## Start offline

```shell
sls offline start
```

## Example

```shell
curl -XPOST {{url}}/dev/message/some-topic -d '{"key": "value", "item": {"name": "awesome"}}'
```
