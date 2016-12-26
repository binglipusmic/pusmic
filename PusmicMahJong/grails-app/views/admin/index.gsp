<!DOCTYPE html>
<html>
    <head>
        <meta name="layout" content="main" />
        <g:set var="entityName" value="${message(code: 'admin.label', default: 'Admin')}" />
        <title><g:message code="default.list.label" args="[entityName]" /></title>
        <script>
            $(function() {
                var url = "${createLink(uri: '/stomp')}";
                var csrfHeaderName = "${request._csrf.headerName}";
                var csrfToken = "${request._csrf.token}";
                var socket = new SockJS(url);
                var client = Stomp.over(socket);
                var headers = {};
                headers[csrfHeaderName] = csrfToken;
                client.connect(headers, function() {
                    // subscriptions etc. [...]
                });
            });
            </script>
    </head>
    <body>
        <a href="#list-admin" class="skip" tabindex="-1"><g:message code="default.link.skip.label" default="Skip to content&hellip;"/></a>
        <div class="nav" role="navigation">
            <ul>
                <li><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></li>
                <li><g:link class="create" action="create"><g:message code="default.new.label" args="[entityName]" /></g:link></li>
            </ul>


        </div>
        <div id="list-admin" class="content scaffold-list" role="main">
            <h1><g:message code="default.list.label" args="[entityName]" /></h1>
            <g:if test="${flash.message}">
                <div class="message" role="status">${flash.message}</div>
            </g:if>
            <f:table collection="${adminList}" />

            <div class="pagination">
                <g:paginate total="${adminCount ?: 0}" />
            </div>
        </div>
    </body>
</html>