VAR bool_tool_ribbon = true  //红丝带

喂喂？那边有人吗？
天啦，有没有人可以来帮帮汪~
* 不好意思，这边没有人
    ->pre_ending
* 怎么了？
    ->introduce
    
->DONE
    
=== pre_ending ===
好吧，那我待会儿再来问问汪~
    ->DONE
    
=== introduce ===
我是负责送蛋糕的外卖汪，但是路上摔了一跤晕倒了，醒来发现蛋糕摔坏了汪！
还好捡到了一个人类用的手机，随便注册了一个账号，就给你发消息了汪！
    
* 捡到手机怎么不交给警察叔叔呢？
* 等等，你是一只狗吗，还能送外卖？

- 嘘，本汪是“阿猫阿狗”的特派外卖汪，一般人都不知道我们这个组织，也不能让人类警知道哦！
* "阿猫阿狗"？好奇怪的名字
    作为餐饮服务业内赫赫有名的组织，你居然没有听过汪！
    我们组织内员工都是猫和狗，人类客户都需要内部介绍才可以预订服务的汪
* 特派外卖汪有什么特别之处吗？
    特派外卖员意味着超高的历史订单完成率和好评率！我是一直保持着100%的最佳员工汪！
    **那你这次岂不是翻车了吗哈哈
        不，我不能翻车，不能让那个经常半路偷吃订单的二哈抢了我的最佳员工！
    **这么厉害！
            所以这一次我也不能失败，一定要完成订单！
            
-你一定要帮帮我，汪！
*我要怎么帮你呢？
    首先，蛋糕半路摔坏这种事一定不能让我们组织知道
    然后，也不能让客人知道
    不然我保持了一百零八天的100%完成率和好评率就没有了汪！
    **明白了，你想让我帮你暗杀掉你们组织所有人和客人？
        ？？本汪可是一颗警星都没有过的良民汪！
    **明白了，你想让我帮你按住shift施展时间回溯大法？
        遗憾的是那个躲在屏幕后面的开发者还没有开发这种功能汪！
    **明白了，你想让我帮你重新订个蛋糕？
        嘿嘿，也不用你那么麻烦
    
    -- 我现在必须要重新做一个蛋糕，在你们人类的城市里
    -- 可是···你们人类城市道路实在是太难以分辨了，之后遇到岔路口就要靠你指路了汪！
    **作为一条狗，居然是路痴？
        咳咳···不要这么大声，别的狗听到会嘲笑我的汪
    **可是我对你所在的地方也不一定熟悉呀
        其实指路是其次，最重要的是你能顺便给一些蛋糕配方的建议
        因为我发现呀，你们人类有时候的口味和我们汪类很不一样

    --
    **不好意思，我现在实在没空
        ->pre_ending
       **好吧，让我来帮你吧
         太好了汪，我就知道你一定是个好人！
         我们现在就准备出发吧
        ->first_corner    
*帮一只狗？我一定是睡眠不足出现了幻觉
->pre_ending

=== first_corner ===
现在该做什么呢
*你现在有什么材料或工具吗
    ->tools
*你现在在什么环境呢
    ->environment
*{tools&&environment}向前走吧
    好的
    ->DONE
*{tools&&environment}向右走吧
    好的
    ->DONE
*{tool&&environment}看看你的汪汪摩托还有什么
    好的
    ->first_corner

=tools
    我有一条从蛋糕盒上抢救下的红丝带 #ribbon
    
    啊~好激动汪，不知道用这些能做出什么样的蛋糕
    *这些根本做不出蛋糕啊喂！
    *没有一样可以吃的呢
    -我知道我知道，但是你一定有办法把这些变成做蛋糕的材料的汪
    -->first_corner

=environment
    我现在正在一个岔路口汪，旁边是被撞坏的汪汪摩托，哎呀~说起来，摩托撞坏了，我还得用我的私房粮去修...
    前面有两条路,一条路直行,道路很是宽阔汪!另一条路往右拐,好像有很多树呢汪!

    ->first_corner

