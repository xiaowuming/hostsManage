!function(t){function e(i){if(a[i])return a[i].exports;var n=a[i]={exports:{},id:i,loaded:!1};return t[i].call(n.exports,n,n.exports,e),n.loaded=!0,n.exports}var a={};return e.m=t,e.c=a,e.p="",e(0)}([function(t,e,a){t.exports=a(1)},function(t,e){"use strict";$(function(){var t={init:function(){this.bindTab(),this.bindBtn()},bindBtn:function(){var t=this;$("#J_delete_all_btn").on("click",function(){t.dialog.confirm("\u786e\u5b9a\u6279\u91cf\u5220\u9664?",function(){t.deleteHosts()})}),$("#J_pause_all_btn").on("click",function(){t.pauseHosts()}),$("#J_start_all_btn").on("click",function(){t.startHosts()}),$("#J_add_group_btn").on("click",function(){t.addGroup()}),$("#J_tab_content").on("click",".J_delete_item",function(){$("input[type=checkbox]").prop("checked",!1),$(this).parents("li").find("input[name=item]").attr("data-select",!0),t.deleteHosts()}).on("click",".invalidAction",function(){var e=$(this);$("input[type=checkbox]").prop("checked",!1),e.parents("li").find("input[name=item]").attr("data-select",!0),e.parents(".item").hasClass("invalid")?t.startHosts():t.pauseHosts()}).on("click",".J_delete_group",function(){t.dialog.confirm("\u786e\u5b9a\u5220\u9664\u8be5\u7ec4?",function(){t.deleteGroup()})}).on("click",".J_edit_group",function(){var e=$(this).parents(".J_pane").attr("data-label");t.editGroup($(this).parents(".J_pane"),e)}).on("click",".J_add_hosts",function(){var e=$(this);t.editHostsForm("\u6dfb\u52a0Hosts","","",function(a,i){var n='<li class="J_item item">                        <div class="select"><input name="item" type="checkbox" data-ip="'+a+'" data-domain="'+i+'" data-isinvalid="false">                        </div>                        <div class="invalidAction">#</div>                        <div class="ip">'+a+'</div>                        <div class="domain">'+i+'</div>                            <div class="delete J_delete_item">x</div>                            </li>';e.parents(".head").after(n),t.startHosts()})}).on("click",".ip,.domain",function(){var e=$(this).parents(".J_item").find("input[name=item]"),a=e.attr("data-ip"),i=e.attr("data-domain");t.editHostsForm("\u4fee\u6539Hosts",a,i,function(a,i){e.attr("data-ip",a).attr("data-domain",i),e.parents(".J_item").find(".ip").text(a),e.parents(".J_item").find(".domain").text(i),t.startHosts()})}).on("change",".J_all_select",function(){$(this).parents(".J_pane").find("input[name=item]").prop("checked",$(this).prop("checked"))}).on("change","input[name=item]",function(){var t=$(this);if(t.prop("checked")){var e=t.parents(".J_pane").find("input[name=item]").size(),a=t.parents(".J_pane").find("input[name=item]:checked").size();e==a&&t.parents(".J_pane").find(".J_all_select").prop("checked",!0)}else t.parents(".J_pane").find(".J_all_select").prop("checked",!1)})},editHostsForm:function(t,e,a,i){var n=this,o=$('<form>                <div class="form-group">                <label for="J_newGroupName">IP:</label>            <input type="text" required class="form-control" name="ip" value="'+e+'" id="J_new_ip" placeholder="IP">                </div>                 <div class="form-group">                <label for="J_newGroupName">Domamin:</label>            <input type="text" required class="form-control" name="domain" value="'+a+'" id="J_new_domain" placeholder="Domain">                </div>            <button type="submit" class="btn btn-info">\u786e\u5b9a</button>            <button type="button" class="btn btn-default" data-dismiss="modal">\u53d6\u6d88</button>                </form>');this.dialog.init(t,o),o.on("submit",function(){return i&&i($("#J_new_ip").val().trim(),$("#J_new_domain").val().trim()),n.dialog.closeDialog(),!1})},deleteGroup:function(){$("#J_nav_tabs").find("li.active").remove(),$("#J_tab_content").find(".J_pane.active").remove(),$("#J_nav_tabs").find("li").eq(1).addClass("active"),$("#J_tab_content").find(".J_pane").eq(0).addClass("active"),this.startHosts()},addGroup:function(){if($(".J_pane").size()>8)return this.dialog.alert("\u4e0d\u80fd\u591a\u4e8e8\u4e2a\u7ec4\u54e6."),!1;var t=this;t.groupEditForm("\u6dfb\u52a0\u7ec4","",function(e){$(".hosts .active").removeClass("active");var a=(new Date).getTime(),i='<li role="presentation" class="active"><a href="#_'+a+'" aria-controls="home" role="tab" data-toggle="tab">'+e+"</a></li>";$("#J_nav_tabs").append(i);var n='<div role="tabpanel" data-label="'+e+'" class="J_pane tab-pane active" id="_'+a+'">                    <ul class="hosts_items"><li class="item head">                    <div class="allSelect">                    <label><input type="checkbox" class="J_all_select"> \u5168\u9009</label>                    </div>                    <div class="action">                    <button class="btn btn-default btn-xs J_add_hosts" type="submit">\u6dfb\u52a0Hosts</button>                    <button class="btn btn-default btn-xs J_edit_group" type="submit">\u4fee\u6539\u7ec4\u540d</button>                    <button class="btn btn-default btn-xs J_delete_group" type="submit">\u5220\u9664\u7ec4</button>                    </div>                    </li></ul></div>';$("#J_tab_content").append(n),t.startHosts()})},editGroup:function(t,e){var a=this;a.groupEditForm("\u4fee\u6539\u7ec4",e,function(e){t.attr("data-label",e),$("#J_nav_tabs .active a").text(e),a.startHosts()})},groupEditForm:function(t,e,a){var i=this,n=$('<form>                <div class="form-group">                <label for="J_newGroupName">\u7ec4\u540d</label>            <input type="text" required class="form-control" name="groupName" value="'+e+'" id="J_newGroupName" placeholder="\u7ec4\u540d">                </div>            <button type="submit" class="btn btn-info">\u786e\u5b9a</button>            <button type="button" class="btn btn-default" data-dismiss="modal">\u53d6\u6d88</button>                </form>');this.dialog.init(t,n),n.on("submit",function(){return a&&a($("#J_newGroupName").val().trim()),i.dialog.closeDialog(),!1})},bindTab:function(){$('a[data-toggle="tab"]').on("shown.bs.tab",function(t){$("input[type=checkbox]").prop("checked",!1)})},getAllHosts:function(){var t={};return $(".J_pane").each(function(){var e=[];t[$(this).attr("data-label")]=e,$(this).find("input[name=item]").each(function(){var t=$(this),a={};a.selected=t.prop("checked"),"true"==t.attr("data-select")&&(a.selected=!0),a.ip=t.attr("data-ip"),a.domain=t.attr("data-domain"),a.isInvalid="true"==t.attr("data-isinvalid")?!0:!1,e.push(a)})}),t},startHosts:function(){var t=this,e=t.getAllHosts();for(var a in e){var i=e[a];for(var n in i){var o=i[n];o.selected&&(o.isInvalid=!1),delete o.selected}}this.postHosts(e,function(){$("input[name=item]:checked,input[data-select=true]").parents(".item").removeClass("invalid"),$("input[type=checkbox],input[data-select=true]").prop("checked",!1).removeAttr("data-select")})},pauseHosts:function(){var t=this,e=t.getAllHosts();for(var a in e){var i=e[a];for(var n in i){var o=i[n];o.selected&&(o.isInvalid=!0),delete o.selected}}this.postHosts(e,function(){$("input[name=item]:checked,input[data-select=true]").parents(".item").addClass("invalid"),$("input[type=checkbox],input[data-select=true]").prop("checked",!1).removeAttr("data-select")})},deleteHosts:function(){var t=this,e=t.getAllHosts(),a={};for(var i in e){a[i]=[];var n=e[i],o=[];for(var s in n){var l=n[s];l.selected||o.push(l),delete l.selected}a[i]=o}this.postHosts(a,function(){$("input[name=item]:checked,input[data-select=true]").parents(".item").remove(),$("input[type=checkbox],input[data-select=true]").prop("checked",!1).removeAttr("data-select")})},postHosts:function(t,e){var a=this;$.ajax({url:"/update",type:"post",data:{content:JSON.stringify(t)},success:function(t){t.result===!1?a.dialog.alert("\u6ca1\u6709\u6743\u9650\u64cd\u4f5c,\u8bf7\u7528[sodu]\u542f\u52a8HostsManage."):e&&e()}})},dialog:{init:function(t,e,a,i){a&&("sm"==a?($("#J_dialog_modal").removeClass("bs-example-modal-lg").addClass("bs-example-modal-sm"),$("#J_dialog_type").removeClass("modal-lg").addClass("modal-sm")):null==a?($("#J_dialog_modal").removeClass("bs-example-modal-lg"),$("#J_dialog_type").removeClass("bs-example-modal-lg")):($("#J_dialog_modal").addClass("bs-example-modal-lg").removeClass("bs-example-modal-sm"),$("#J_dialog_type").addClass("modal-lg").removeClass("modal-sm"))),1==i?$("#J_dialog_modal").modal("show"):$("#J_dialog_modal").modal({backdrop:"static",keyboard:!1}),$("#J_dialog_title").html(t),"string"==typeof e?$("#J_dialog_content").html(e):$("#J_dialog_content").empty().append(e)},alert:function(t,e,a){var i=this,n='<div></div><div class="fn14"> '+t+'</div><div class="ac mt10 bt1 pt10"><button type="button" id="J_confirm_btn" class="btn btn-success">\u786e\u5b9a</button></div></div>';$("#J_dialog_modal").modal("show"),i.init("\u63d0\u793a",n,a||"sm"),$("#J_confirm_btn").on("click",function(){i.closeDialog(),e&&e()})},confirm:function(t,e){var a=this,i='<div></div><div class="fn14"><i class="glyphicon glyphicon-question-sign orange"></i> '+t+'</div><div class="ar mt10 bt1 pt10"><button type="button" id="J_confirm_btn" class="btn btn-success">\u786e\u5b9a</button><button type="button" id="J_cancel_btn" class="btn btn-default ml10">\u53d6\u6d88</button></div></div>';$("#J_dialog_modal").modal("show"),a.init("\u8bf7\u786e\u8ba4",i,"sm"),$("#J_cancel_btn").on("click",a.closeDialog),$("#J_confirm_btn").on("click",function(){a.closeDialog(),setTimeout(function(){e()},500)})},closeDialog:function(t){$("#J_dialog_modal").modal("hide"),"function"==typeof t&&setTimeout(function(){t()},600)}}};t.init()})}]);