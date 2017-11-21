class ModelTagnamesMixin(object):
    @property
    def tagnames(self):
        return [tag.name for tag in self.tags]
