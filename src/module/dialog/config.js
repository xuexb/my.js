/**
 * 弹出层配置
 * @author xieliang
 * @email admin@xuexb.com
 */

define({
    tpl: '<div data-node="dialog" class="ui-dialog">\
               <table class="ui-dialog-grid">\
                   <tr>\
                       <td data-node="header" class="ui-dialog-header">\
                           <a herf="#" data-node="close" class="ui-dialog-close">&#215;</a>\
                           <div data-node="title" class="ui-dialog-title"></div>\
                       </td>\
                   </tr>\
                   <tr>\
                       <td data-node="body" class="ui-dialog-body">\
                           <div data-node="content" class="ui-dialog-content"></div>\
                       </td>\
                   </tr>\
                   <tr>\
                       <td data-node="footer" class="ui-dialog-footer">\
                           <div data-node="buttons" class="ui-dialog-buttons"></div>\
                       </td>\
                   </tr>\
               </table>\
        </div>',
    id: null,
    width: 'auto',
    height: 'auto',
    content: 'loading',
    title: '标题',
    button: null,
    ok: null,
    okValue: '确认',
    cancel: '',
    cancelValue: '取消',
    initialize: null,
    beforeunload: null,
    className: '',
    time: 0,
    show: true,
    lock: true,
    fixed: false,
    zIndex: 2000,
    backgroundColor: '#000',
    backgroundOpacity: 0.3
});