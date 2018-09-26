#!/bin/sh
case "$CIRCLE_BRANCH" in
master) BUILD_ENV=production ;;
rivet-react) BUILD_ENV=foobar ;;
*) BUILD_ENV=test ;;
esac
echo "Build environment set to: $BUILD_ENV"
