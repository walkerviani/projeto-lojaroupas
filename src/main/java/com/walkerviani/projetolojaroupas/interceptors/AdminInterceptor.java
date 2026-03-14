package com.walkerviani.projetolojaroupas.interceptors;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@Component
public class AdminInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception{
        HttpSession session = request.getSession(false);

        if (session == null || session.getAttribute("LoggedUser") == null) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Not authenticated");
            return false;
        }
        String role = (String) session.getAttribute("UserRole");
        if (role == null || !role.equals("ADMIN")) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Access denied");
            return false;
        }
        return true;
    }
}
