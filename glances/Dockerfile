FROM python:3.9

RUN pip install --no-cache-dir glances[action,browser,cpuinfo,chart,docker,export,folders,gpu,ip,raid,snmp,web,bottle,psutil,ujson]

ENTRYPOINT ["glances", "-w", "-B", "0.0.0.0", "-p", "9000"]