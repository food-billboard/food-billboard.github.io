---
title: 基于Tus协议的文件上传流程
date: 2020-12-28 20:18:00
tags: tus upload file 
banner_img: /images/基于Tus协议的文件上传流程/tus.jpg
index_img: /images/基于Tus协议的文件上传流程/tus.jpg
categories: 
  - 文件
  - 上传
  - 前端  
  - 后端  
---
 
## 介绍
最近一直都在弄关于文件上传方面的问题，如果只是小文件的话，基本直接`post`上传就可以解决，但是当面对大文件时，如果还是只用简单的请求可能无法完成文件的上传. 

假设当前用户要上传一个`2G`的视频文件. 可能就会遇到许多问题: 
1. 首先最大的问题就是，服务端不可能接受前端在一次请求中上传如此大的`body`.  
2. 所以不得不选择将大文件分成多个小文件分多次上传，基本可以解决问题. 但是如果出现一些不可控的原因导致文件上传中断，用户只能选择重新上传，而重新上传意味着之前上传的内容又得再一次上传，如果用户在一个网络环境很差的情况下，这个文件就根本无法完成上传。

基于以上的情况，通过`Tus`协议来实现分片上传以及断点续传的功能便能达到相当好的用户体验。下面就来讲讲这个实现过程。

## Tus 
什么是`Tus`，`Tus`是基于`HTTP`的可恢复文件上传协议。可恢复意味着可以随时中断上载，并且可以继续上载而无需再次重新上载先前的数据。  

`Tus`官网上有许多实现的库可供使用。而作为一个前端选手，必然用的`tus-js-client`，而我一开始接触的时候用的是文件上传工具`filepond`(其实之前还用过`uppy`，因为它`github`✨多，而且它原生就支持`Tus`协议，你问我为什么不用那个，因为我看不懂😬)。  
幸好在`filepond`的issues中看到貌似它也可以和`Tus`结合使用🙂。  

其实`filepond`使用来说还算是不错的体验，但是它似乎没有针对**断点续传**方面做过处理，可能也有可能是因为我太菜了吧。  下面是`filepond`的样子，挺好看。  
<img src="/images/基于Tus协议的文件上传流程/filepond效果.png" />

## 前后端基本交互流程 
<img src="/images/基于Tus协议的文件上传流程/tus.jpg" />

基于上面的流程图这里简单描述一下并讲讲其中一些注意的地方。  
1. 客户端首先向服务端发送`options`请求。获取服务端的配置，  
比如服务端支持的`tus`版本，或者支持的`tus`扩展。  
2. 如果服务端支持，客户端可以选择:  
  - 向服务端发起`post`请求创建文件副本  
  - 发送`post`请求的同时发送部分文件分片  
  - 直接发送`head`请求尝试恢复上传，如果失败则回退到`post`创建文件。  
3. 服务端返回文件的相关信息用于后续文件上传请求。  
  - 恢复上传: 根据服务端返回的响应头`Upload-Offset`从指定文件位置开始恢复上传  
  - 首次上传: 从文件开始位置上传。也就是`0`。  
4. 重复发起`patch`请求发送文件分片，根据服务端响应的`Upload-Offset`来确定下一分片位置。
如果它的值等于文件的大小，说明文件上传已经完成。  
5. 至此整个文件上传流程完成。  

## Tus 扩展  
`Tus`还有许多扩展用于帮助开发者实现更多的功能。在上面的流程中已经用到了一些。  
以下所有的扩展都需要服务端支持。  
官方的方法是在`options`请求当中的响应中根据`Tus-Extension`响应头来分析具体服务端所接受的扩展。  
下面的扩展会影响到上面请求流程中的很多地方，也会在下面介绍。(很多地方其实还是对官网的翻译，如果有兴趣的可以去官网继续学习更多的内容😊)  

1. Creation  
在文件上传前在服务端创建文件信息  
可以将文件的相关信息预先在存储在服务端，这样可以为后续文件分片上传做参照。  
比如可以将文件唯一标识符`md5`先进行上传，服务端存储数据库，保存每一上传的分片。  

前端可以把一些文件信息放在`Upload-Metadata`请求头中  

<img src="/images/基于Tus协议的文件上传流程/creation-post-req.png" />
<img src="/images/基于Tus协议的文件上传流程/creation-post-response.png" />

服务端会返回`Location`告知前端文件的上传地址。  

2. Creation-With-Upload  
在服务端创建请求中添加文件分片内容  
为了节省流量，在服务端允许的情况下，可以在向服务端创建请求的同时也将某一分片一同上传。  

和`Creation`类似，也会返回`Location`头，同时会返回`Upload-Offset`设置下一分片的索引。  
<img src="/images/基于Tus协议的文件上传流程/creation-with-upload-req.png" />
<img src="/images/基于Tus协议的文件上传流程/creation-with-upload-res.png" />

3. Expiration  
临时文件的过期时间  
服务端的存储空间毕竟有限，不可能无时限的将文件的分片保存在服务端的数据库中。  
所以服务端可以设置分片的存储时间，并通过响应头`Upload-Expires`告知前端它的过期时间。  
当超过服务端规定的时间之后，用户需要重新在服务端创建文件副本，重新上传。  
<img src="/images/基于Tus协议的文件上传流程/expiration-req.png" />
<img src="/images/基于Tus协议的文件上传流程/expiration-res.png" /> 

当前端发送文件分片响应时，服务端会添加响应头`Upload-Expires`告知前端该分片过期时间，如果超过时间，服务端将会返回`404`，前端需要重新上传。  

4. Checksum  
分片大小检查  
服务端可以对前端发送的文件分片进行校验。  
在上传前获取服务端上传配置支持度信息时，前端可以根据`Tus-Checksum-Algorithm`字段知道服务端支持的加密算法。  

有时无法一开始就做出相应的计算，并且在服务端支持的情况下，可以使用`Trailer`请求头在完成上传后再进行校验。  
服务端可以在一开始`options`的`Tus-Extension`中添加`Checksum-Trailer`字段表示支持该功能。  
比如对文件进行`md5`加密，需要对文件分片一一进行处理。  

当上传校验失败时，服务端便会丢弃此分片，索引也不会发生改变。  
<img src="/images/基于Tus协议的文件上传流程/checksum-options-req.png" />
<img src="/images/基于Tus协议的文件上传流程/checksum-options-req.png" />
<img src="/images/基于Tus协议的文件上传流程/checksum-patch-req.png" />
<img src="/images/基于Tus协议的文件上传流程/checksum-patch-res.png" /> 

上述例子中  
- 服务端`options`响应中`Tus-Checksum-Algorithm: md5,sha1,crc32`展示了其支持的校验算法  
- 前端`patch`请求`Upload-Checksum: sha1 Kq5sNclPz7QV2+lfQIuc6R7oRu0=`使用`sha1`算法。  
- 服务端校验通过返回`204`
- 若失败，则返回以下状态码(`400`: 算法不支持，`460`: 校验和不匹配)
官网上介绍`The Upload-Checksum request header contains information about the checksum of the current body payload. The header MUST consist of the name of the used checksum algorithm and the Base64 encoded checksum separated by a space.`  
大概说上面的`Upload-Checksum`头由`sha1`算法和由`base64`编码的校验和组成，但是我不是太能理解这个，不管是使用base64解码或者用sha1解码似乎都无法解码出`Kq5sNclPz7QV2+lfQIuc6R7oRu0=`，如果有懂的大佬的话可以给解释解释😃。  

5. Termination  
文件删除  
这个应该没什么好说的，就是向服务端请求删除文件信息。  
<img src="/images/基于Tus协议的文件上传流程/termination-req.png" />
<img src="/images/基于Tus协议的文件上传流程/termination-res.png" />

6. Concatenation  
并行上传  
对于一个大文件，如果是一个个分片串行上传，可能还是有点慢。  
`tus`支持可以实行并行上传，可以针对同一个文件资源在服务端生成多个上传地址，这样就可以同时上传文件的不同分片。  
当然这也需要服务端支持。  
<img src="/images/基于Tus协议的文件上传流程/Concatenation-post-req-1.png" />
<img src="/images/基于Tus协议的文件上传流程/Concatenation-post-res-1.png" />
<img src="/images/基于Tus协议的文件上传流程/Concatenation-post-req-2.png" />
<img src="/images/基于Tus协议的文件上传流程/Concatenation-post-res-2.png" />
<img src="/images/基于Tus协议的文件上传流程/Concatenation-patch-req-1.png" />
<img src="/images/基于Tus协议的文件上传流程/Concatenation-patch-res-1.png" />
<img src="/images/基于Tus协议的文件上传流程/Concatenation-patch-req-2.png" />
<img src="/images/基于Tus协议的文件上传流程/Concatenation-patch-res-2.png" />
<img src="/images/基于Tus协议的文件上传流程/Concatenation-post-req-4.png" />
<img src="/images/基于Tus协议的文件上传流程/Concatenation-post-res-4.png" />
<img src="/images/基于Tus协议的文件上传流程/Concatenation-head-req.png" />
<img src="/images/基于Tus协议的文件上传流程/Concatenation-head-res.png" />

上述例子中
- 先是在开始时发送两个`post`请求并携带`Upload-Concat: partial`请求头，在服务端生成了两个上传地址`https://tus.example.org/files/a`和`https://tus.example.org/files/b`  
- 接着就可以同时在两个地址上传同一个文件，以此来提高效率。  
- 当上传完所有分片后，发送`post`请求并携带`Upload-Concat: final;/files/a /files/b`，格式为`final;`加上上一步中生成的上传地址，以空格分隔。服务端响应合成路径`Location: https://tus.example.org/files/ab`告知前端文件的地址。  该顺序需要和`post`中返回的地址顺序一致，否则可能会导致服务端文件分片合并出错。  
- 前端发送`head`请求，服务端接收到请求完成这个文件分片的合并。  

就我个人看法，`Tus`协议提供的是一种思想，让我们在文件上传任务中出现的任何情况都能得到相应的应对方法，完美完成整个上传流程。  
所在上面所介绍的扩展，不严谨的讲，我们可以用自己的方法来实现，它的作用就是能让两端能更好的理解当前的文件的上传情况。  
我们不必太过于拘泥于相应的api，只需要能让两端更好，更容易的协作就好。  

还有，在我使用前端`tus`的`tus-js-client`工具时，检查`api`介绍以及粗略查找了下源码，看到它似乎对于`tus`扩展只实现了`Creation`、`Creation-With-Upload`、`Concatenation`这几个扩展，如果想使用其他扩展可能需要自行实现。  
不过其他几个扩展的重点在后端，这也可能是它没有实现的原因。(也可能是我没看懂😝)  

## 结束
文件上传其中还有需要的知识，包括文件的分片，前端的文件处理方式以及关于文件的加密等。包括这里的`Tus`，也还有很多地方不是很理解，如果有哪里错了，先道个歉，欢迎各位给指正。--好好学习🐱。