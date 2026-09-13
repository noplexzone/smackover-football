FROM nginx:1.28.0-alpine
ARG VCS_REF
LABEL org.opencontainers.image.revision=$VCS_REF
COPY dist/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
