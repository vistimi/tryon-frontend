ARG VARIANT=node:18.8.0-alpine

#----------------
#    BUILDER
#----------------
FROM ${VARIANT} AS builder

WORKDIR /usr/tmp

RUN apk add --update --no-cache libc6-compat

ARG TARGETOS TARGETARCH
COPY . .
# COPY package.json yarn.lock ./
RUN yarn install

ENV NEXT_PUBLIC_API_URL=http://viton-hd.vistimi.com
RUN yarn build

#-----------------
#    RUNNER
#-----------------
FROM ${VARIANT} AS runner

ARG USER_NAME=user
ARG USER_UID=1001
ARG USER_GID=$USER_UID
RUN apk update && apk add --update sudo
RUN addgroup --gid $USER_GID $USER_NAME \
    && adduser --uid $USER_UID -D -G $USER_NAME $USER_NAME \
    && echo $USER_NAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USER_NAME \
    && chmod 0440 /etc/sudoers.d/$USER_NAME
USER $USER_NAME

WORKDIR /usr/app

COPY --chown=$USER_NAME:$USER_GID --from=builder /usr/tmp/node_modules ./node_modules
COPY --chown=$USER_NAME:$USER_GID --from=builder /usr/tmp/.next ./.next
COPY --chown=$USER_NAME:$USER_GID --from=builder /usr/tmp/package.json ./package.json
COPY --chown=$USER_NAME:$USER_GID --from=builder /usr/tmp/public ./public

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

ENV PORT=3000
EXPOSE $PORT

CMD ["/bin/sh", "-c", "yarn start"]