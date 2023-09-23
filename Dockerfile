ARG VARIANT=node:18.8.0-alpine

#----------------
#    BUILDER
#----------------
FROM ${VARIANT} AS builder

WORKDIR /usr/tmp

RUN apk add --update --no-cache libc6-compat

COPY package.json yarn.lock ./
RUN yarn install
RUN yarn build

#-----------------
#    RUNNER
#-----------------
FROM ${VARIANT} AS runner

ARG USER_NAME=user
ARG USER_UID=1000
ARG USER_GID=$USER_UID
RUN apk update && apk add --update sudo
RUN addgroup --gid $USER_GID $USER_NAME \
    && adduser --uid $USER_UID -D -G $USER_NAME $USER_NAME \
    && echo $USER_NAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USER_NAME \
    && chmod 0440 /etc/sudoers.d/$USER_NAME
USER $USER_NAME

WORKDIR /usr/app

COPY --from=builder /usr/tmp/node_modules ./node_modules
COPY --from=builder /usr/tmp/.next ./.next
COPY --from=builder /usr/tmp/package.json ./package.json

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

ARG PORT=3000
EXPOSE $PORT

ENV PORT $PORT

CMD ["yarn", "start"]