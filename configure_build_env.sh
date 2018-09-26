#!/bin/sh
case "$CIRCLE_BRANCH" in
master) BUILD_ENV=production ;;
*) BUILD_ENV=test ;;
esac
echo "Build environment set to: $BUILD_ENV"
