This API allows the **JGlo Intellij plugin** to authenticate an user in a secure way.
This was created to avoid store the OAuth app client secret in the plugin itself. 

To use this project you will need to create a config.json like this:

```
{
  "https": true,
  "clientId": "your client id",
  "clientSecret": "your client secret"
}
```