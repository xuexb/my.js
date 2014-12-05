<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{{title}}</title>
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.4/styles/monokai_sublime.min.css">
<script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.4/highlight.min.js"></script>


    <style type="text/css">
        
/*markdown*/
.markdown-body {
    overflow:hidden;
    font-family:"Helvetica Neue", Helvetica, "Segoe UI", Arial, freesans, sans-serif;
    font-size:16px;
    line-height:1.6;
    word-wrap:break-word
}
.markdown-body a{color: #4183c4;}
.markdown-body>*:first-child {
    margin-top:0 !important
}
.markdown-body>*:last-child {
    margin-bottom:0 !important
}


.markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4, .markdown-body h5, .markdown-body h6 {
    position:relative;
    margin-top:1em;
    margin-bottom:16px;
    font-weight:bold;
    line-height:1.4
}
.markdown-body h1 {
    padding-bottom:0.3em;
    font-size:2.25em;
    line-height:1.2;
    border-bottom:1px solid #eee
}
.markdown-body h2 {
    padding-bottom:0.3em;
    font-size:1.75em;
    line-height:1.225;
    border-bottom:1px solid #eee
}
.markdown-body h3 {
    font-size:1.5em;
    line-height:1.43
}
.markdown-body h4 {
    font-size:1.25em
}
.markdown-body h5 {
    font-size:1em
}
.markdown-body h6 {
    font-size:1em;
    color:#777
}
.markdown-body p, .markdown-body blockquote, .markdown-body ul, .markdown-body ol, .markdown-body dl, .markdown-body table, .markdown-body pre {
    margin-top:0;
    margin-bottom:16px
}
.markdown-body hr {
    height:4px;
    padding:0;
    margin:16px 0;
    background-color:#e7e7e7;
    border:0 none
}
.markdown-body ul, .markdown-body ol {
    padding-left:2em
}

.markdown-body ul ul, .markdown-body ul ol, .markdown-body ol ol, .markdown-body ol ul {
    margin-top:0;
    margin-bottom:0
}
.markdown-body ul{list-style-type: disc;}
.markdown-body ol{list-style-type: decimal;}
.markdown-body li>p {
    margin-top:16px
}
.markdown-body dl {
    padding:0
}
.markdown-body dl dt {
    padding:0;
    margin-top:16px;
    font-size:1em;
    font-style:italic;
    font-weight:bold
}
.markdown-body dl dd {
    padding:0 16px;
    margin-bottom:16px
}
.markdown-body blockquote {
    padding:0 15px;
    color:#777;
    border-left:4px solid #ddd
}
.markdown-body blockquote>:first-child {
    margin-top:0
}
.markdown-body blockquote>:last-child {
    margin-bottom:0
}
.markdown-body table {
    display:block;
    width:100%;
    overflow:auto;
    word-break:normal;
    word-break:keep-all
}
.markdown-body table th {
    font-weight:bold
}
.markdown-body table th, .markdown-body table td {
    padding:6px 13px;
    border:1px solid #ddd
}
.markdown-body table tr {
    background-color:#fff;
    border-top:1px solid #ccc
}
.markdown-body table tr:nth-child(2n) {
    background-color:#f8f8f8
}
.markdown-body img {
    max-width:100%;
    -moz-box-sizing:border-box;
    box-sizing:border-box
}

/*.markdown-body code,*/ .markdown-body tt {
    padding:0 2px;
    padding-top:0.2em;
    padding-bottom:0.2em;
    margin:0;
    font-size:85%;
    background-color:rgba(0, 0, 0, 0.1);
    border-radius:3px
}

.markdown-body code br, .markdown-body tt br {
    display:none
}
.markdown-body del code {
    text-decoration:inherit;
    vertical-align:text-top
}
/*.markdown-body pre>code {
    padding:0;
    margin:0;
    font-size:100%;
    word-break:normal;
    white-space:pre;
    background:transparent;
    border:0
}

.markdown-body pre {
    word-wrap:normal
}
.markdown-body pre code, .markdown-body pre tt {
    display:inline;
    max-width:initial;
    padding:0;
    margin:0;
    overflow:initial;
    line-height:inherit;
    word-wrap:normal;
    background-color:transparent;
    border:0
}

.markdown-body pre{border: 1px solid  #ccc;padding: 5px;border-radius:3px;background-color:rgba(0, 0, 0, 0.07);}
*/

code{
    padding:0 2px;
    padding-top:0.2em;
    padding-bottom:0.2em;
    margin:0;
    font-size:85%;
    background-color:rgba(0, 0, 0, 0.1);
    border-radius:3px
}


body{
    padding:30px;
}
    </style>
</head>
<body >
    
    <div class="markdown-body">
        {{body}}
    </div>
    

    <script>hljs.initHighlightingOnLoad();</script>
</body>
</html>