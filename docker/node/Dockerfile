FROM node:16
COPY configs/sysctl.conf /etc/sysctl.conf
COPY configs/limits.conf /etc/security/limits.conf
CMD [ "sysctl", "--systems" ]