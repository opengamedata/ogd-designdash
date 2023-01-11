.PHONY: build deploy

build:
	gulp styles

# deploy-site:
# 	rsync -vrc ./site/* mli-field@fielddaylab.wisc.edu:/httpdocs/opengamedata --exclude-from rsync-exclude

deploy-test:
	rsync -vrc ./build/* mli-field@fielddaylab.wisc.edu:/httpdocs/opengamedata-ci --exclude-from rsync-exclude

