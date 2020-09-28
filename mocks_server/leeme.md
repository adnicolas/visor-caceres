## Mock files

As you probably understood, mock files' naming conventions are based on the response that they are going to serve:

```
$REQUEST-PATH/$HTTP-METHOD.mock

```

For example, let's say that you wanna mock the response of a POST request to  `/users`, you would simply need to create a file named  `POST.mock`  under  `users/`.

The content of the mock files needs to be a valid HTTP response, for example:

```
HTTP/1.1 200 OK
Content-Type: text/xml; charset=utf-8

{
   "Accept-Language": "en-US,en;q=0.8",
   "Host": "headers.jsontest.com",
   "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.3",
   "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
}

```

Check  [our own mocks](https://github.com/namshi/mockserver/tree/master/test/mocks)  as a reference.