case "$OSTYPE" in
  solaris*) echo "unsupported OS. Please use your own webserver." ;;
  darwin*)  ./bin/codoku_darwin_amd64 ;; 
  linux*)   ./bin/codoku_linux_amd64 ;;
  bsd*)     ./bin/codoku_bsd_amd64 ;;
  msys*)    echo "Run codoku.bat file instead." ;;
  *)        echo "unsupported OS: $OSTYPE please use your own webserver." ;;
esac