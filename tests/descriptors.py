"""Offline stdlib checks; never search Google or contact a verifier."""
from pathlib import Path
import unittest
import xml.etree.ElementTree as ET
from urllib.parse import urlsplit, parse_qs

ROOT = Path(__file__).resolve().parents[1]
NS = "{http://a9.com/-/spec/opensearch/1.1/}"

class Descriptors(unittest.TestCase):
    def test_both_arms_and_legacy_urls(self):
        for arm, name, udm in [("web", "Google Web", "14"), ("ai", "Google AI Mode", "50")]:
            for suffix in ["", "-v2"]:
                with self.subTest(arm=arm, suffix=suffix):
                    tree = ET.parse(ROOT / "osdd" / f"{arm}{suffix}.xml").getroot()
                    self.assertEqual(tree.tag, NS + "OpenSearchDescription")
                    self.assertEqual(tree.findtext(NS + "ShortName"), name)
                    self.assertEqual(tree.findtext(NS + "InputEncoding"), "UTF-8")
                    urls = tree.findall(NS + "Url")
                    self.assertEqual(len(urls), 1)
                    self.assertEqual(urls[0].get("type"), "text/html")
                    self.assertEqual(urls[0].get("method"), "get")
                    url = urlsplit(urls[0].get("template"))
                    self.assertEqual((url.scheme, url.netloc, url.path), ("https", "www.google.com", "/search"))
                    self.assertEqual(parse_qs(url.query), {"q": ["{searchTerms}"], "udm": [udm]})
                    self.assertEqual(url.fragment, "")

if __name__ == "__main__":
    unittest.main()
