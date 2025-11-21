FROM amazoncorretto:17

WORKDIR /workspace

COPY run.sh /run.sh
RUN chmod +x /run.sh

ENTRYPOINT ["/run.sh"]