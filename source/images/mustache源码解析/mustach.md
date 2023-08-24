
1. mustache.render(字符串, 数据, 未知, {
  tags: 标识符，默认["{{", "}}"]
})

2. writer.render(参数同上) 

  1. getConfigTags 获取实际的标识符  

  2. writer.parse(字符串, 标识符)    
    1. this.templateCache，找缓存，有就直接返回  

    2. parseTemplate(字符串, 标识符)   

      1. compileTags 解析处理标识符  
        openingTagRe `/\{\{\s*/`
        closingTagRe `/\s*\}\}/`  
        closingCurlyRe `/\s*\}\}\}/`   

      2. new Scanner  
      3. while(eos是否有剩余未处理字符 )  
        1. scanUntil(openingTagRe) 解析  
          1. 根据正则去截取字符串  
          2. 更新tail，剩余字符 和 更新pos，匹配位置   
          3. 返回当前匹配字符串  
        2. 

  3. new Context 

  4. renderTokens  

